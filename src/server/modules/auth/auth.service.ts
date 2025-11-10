import {
  NormalizedPasskey,
  RequestWebauthnOptions,
  StoredPasskey,
} from "@/common/types";
import { authStorage, relayer, wallet } from "@/lib/ethersClient";
import { fromException } from "@/server/errors/exceptions";
import {
  generateAuthenticaterOptions,
  generateRegisterOptions,
  verifyAuthenticaterCredential,
  verifyRegisterCredential,
} from "./webAuthn";
import {
  issueAuthenticationChallengeToken,
  issueRegistrationChallengeToken,
} from "./token";
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
  AuthenticatorTransportFuture,
} from "@simplewebauthn/server";
import { Device, OS } from "@/common/enums";
import { encrypt, decrypt } from "@/lib/crypto";

// deviceType
// :
// "Desktop"
// os
// :
// "macOS"

export const getRpID = () => {
  let result: string;

  const env = process.env.ENV;

  if (env === "development") {
    result = "localhost";
  } else if (env === "production") {
    result = "in-labs.xyz";
  } else {
    throw fromException("Auth", "INVALID_ORIGIN");
  }

  return result;
};

export const getAdminCode = () => {
  return process.env.NEXT_PUBLIC_ADMIN_CODE ?? "";
};

export const getAdminCodeHash = () => {
  const hash = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH ?? "";

  if (hash.length === 0) {
    throw fromException("System", "ADMIN_AUTH_CODE_HASH_NOT_FOUND");
  }

  return hash;
};

export const getPasskey = async (address: string, device: Device) => {
  try {
    const rawPasskey = await authStorage
      .connect(relayer)
      .getPasskey(address, device);

    const passkey = rawPasskey
      .filter(([, credentialId, passkey]: [bigint, string, string]) => {
        if (credentialId.length === 0 || passkey.length === 0) {
          return false;
        }
        return true;
      })
      .map(([, , passkey]: [bigint, string, string]) =>
        reviveBuffers(JSON.parse(decrypt(passkey, getAdminCodeHash())))
      );

    return passkey;
  } catch (error: unknown) {
    const reason = extractContractErrorReason(error);

    if (reason === "AuthStorage: user not registered") {
      throw fromException("User", "USER_NOT_FOUND");
    }
  }
};

export const getPasskeys = async (address: string) => {
  try {
    const rawPasskeys = await authStorage.connect(relayer).getPasskeys(address);
    const passkeys = rawPasskeys
      .filter(
        ([, credentialId, encrypted]: [bigint, string, string]) =>
          credentialId.length > 0 && encrypted.length > 0
      )
      .map(([, , encrypted]: [bigint, string, string]) =>
        reviveBuffers(JSON.parse(decrypt(encrypted, getAdminCodeHash())))
      );

    return passkeys;
  } catch (error: unknown) {
    const reason = extractContractErrorReason(error);

    if (reason === "AuthStorage: user not registered") {
      throw fromException("User", "USER_NOT_FOUND");
    }
  }
};

export const responseAuthenticationOption = async (email: string) => {
  const rpId = getRpID();
  const address = await wallet(email).getAddress();

  const passkeys = (await getPasskeys(address)) as NormalizedPasskey[];
  if (passkeys.length === 0) {
    throw fromException("Auth", "NO_PASSKEY");
  }
  const credentialIds = passkeys
    .map((pk) => pk.credential.idBase64Url)
    .filter((value): value is string => Boolean(value));
  if (credentialIds.length === 0) {
    throw fromException("Auth", "NO_PASSKEY");
  }

  const options = await generateAuthenticaterOptions(rpId, passkeys);
  const jwt = await issueAuthenticationChallengeToken({
    challenge: options.challenge,
    email,
    credentialIds,
  });

  return { options, jwt };
};

export const responseAuthenticationVerify = async (
  email: string,
  credential: AuthenticationResponseJSON,
  challenge: string
) => {
  const address = await wallet(email).getAddress();
  const passkeys = (await getPasskeys(address)) as NormalizedPasskey[];
  if (passkeys.length === 0) {
    throw fromException("Auth", "NO_PASSKEY");
  }

  const verified = await verifyAuthenticaterCredential(
    passkeys[0],
    credential,
    challenge
  );

  return verified;
};

export const responseRegistrationOption = async ({
  email,
  allowMultipleDevices,
}: RequestWebauthnOptions) => {
  const rpId = getRpID();

  let passkeys: NormalizedPasskey[] = [];
  const address = await wallet(email).getAddress();

  if (allowMultipleDevices) {
    passkeys = await getPasskeys(address);
  }

  const options = await generateRegisterOptions(rpId, email, passkeys);
  const jwt = await issueRegistrationChallengeToken({
    challenge: options.challenge,
    email,
  });

  return { options, jwt };
};

export const responseRegistrationVerify = async (
  { email, device, os }: RequestWebauthnOptions,
  credential: RegistrationResponseJSON,
  challenge: string
) => {
  const adminCodeHash = getAdminCodeHash();
  const address = await wallet(email).getAddress();

  const { verified, registrationInfo } = await verifyRegisterCredential(
    credential,
    challenge
  );
  if (!verified) {
    throw fromException("Auth", "FAILED_VERIFY_CREDENTIAL");
  }

  const resolvedDevice =
    typeof device === "number" && Device[device] !== undefined
      ? device
      : Device.Desktop;
  const resolvedOs =
    typeof os === "number" && OS[os] !== undefined ? os : OS.Others;

  const deviceLabel = Device[resolvedDevice];
  const osLabel = OS[resolvedOs];

  const adminDeviceInfo = {
    deviceType: deviceLabel,
    deviceEnum: resolvedDevice,
    os: osLabel,
    osEnum: resolvedOs,
  };

  const serialized = JSON.stringify(
    {
      ...registrationInfo,
      adminDeviceInfo,
    },
    toBase64Replacer,
    2
  );
  const encrypted = encrypt(serialized, adminCodeHash);

  // 블록체인에 저장
  const contract = authStorage.connect(relayer);
  const registration = await contract.registration(
    address,
    email,
    resolvedDevice,
    resolvedOs,
    credential.id,
    encrypted
  );
  const receipt = await registration.wait();
  if (!receipt?.status) {
    throw fromException("Auth", "FAILED_REGISTER_PASSKEY");
  }

  return verified;
};

type ContractErrorLike = {
  reason?: string;
  shortMessage?: string;
  error?: { message?: string };
};

const extractContractErrorReason = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const { reason, shortMessage, error: nested } = error as ContractErrorLike;
    return (
      reason ?? shortMessage ?? nested?.message ?? "Unknown contract error"
    );
  }
  return "Unknown contract error";
};

const toBase64Replacer = (_key: string, value: unknown) => {
  if (value instanceof ArrayBuffer) {
    return Buffer.from(value).toString("base64");
  }
  if (ArrayBuffer.isView(value)) {
    const view = value as ArrayBufferView;
    return Buffer.from(view.buffer, view.byteOffset, view.byteLength).toString(
      "base64"
    );
  }
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return (value as Buffer).toString("base64");
  }
  return value;
};

const decodeBase64 = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, "base64");
};

const bufferToBase64Url = (buffer: Buffer) =>
  buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const reviveBuffers = (passkey: StoredPasskey): NormalizedPasskey => {
  const { credential } = passkey;
  if (!credential || typeof credential.id !== "string") {
    throw new Error("Invalid passkey credential format.");
  }

  const {
    id,
    publicKey,
    transports: storedTransports,
    counter,
    ...rest
  } = credential;
  const idBase64 = id;
  const idBuffer = decodeBase64(idBase64);
  const transportsSource = storedTransports ?? [];
  const transports = transportsSource.filter(
    (transport): transport is AuthenticatorTransportFuture =>
      typeof transport === "string"
  );
  const publicKeyBuffer = decodeBase64(publicKey);
  const publicKeyArrayBuffer = new ArrayBuffer(publicKeyBuffer.length);
  const publicKeyUint8: Uint8Array<ArrayBuffer> = new Uint8Array(
    publicKeyArrayBuffer
  );
  publicKeyUint8.set(publicKeyBuffer);

  return {
    ...passkey,
    credential: {
      ...rest,
      id: idBase64,
      idBuffer,
      idBase64,
      idBase64Url: bufferToBase64Url(idBuffer),
      publicKey: publicKeyUint8,
      publicKeyBuffer,
      counter,
      transports,
    },
    attestationObject:
      typeof passkey.attestationObject === "string"
        ? decodeBase64(passkey.attestationObject)
        : undefined,
  };
};
