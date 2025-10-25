import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  AuthenticatorTransportFuture,
  VerifiedAuthenticationResponse,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import { WebauthnOptions } from "@/common/types";
import { fromException } from "@/server/errors/exceptions";
import {
  issueRegistrationChallengeToken,
  issueAuthenticationChallengeToken,
} from "./token";
import { passkeyStorage, relayer, wallet } from "@/lib/ethersClient";
import { putObject } from "@/server/modules/aws/s3";

export const allowedOrigins = {
  local: "http://localhost:3000",
  prod: "https://in-study.xyz",
};
export const rpIds = {
  local: "localhost",
  prod: "in-study.xyz",
};

type StoredPasskey = {
  credential: {
    id: string;
    publicKey: string;
    counter: number;
    transports?: AuthenticatorTransportFuture[] | string[];
  };
  attestationObject?: string;
  [key: string]: unknown;
};

type NormalizedPasskey = {
  credential: {
    id: string;
    idBuffer: Buffer;
    idBase64: string;
    idBase64Url: string;
    publicKey: Uint8Array<ArrayBuffer>;
    publicKeyBuffer: Buffer;
    counter: number;
    transports: AuthenticatorTransportFuture[];
    [key: string]: unknown;
  };
  attestationObject?: Buffer;
  [key: string]: unknown;
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

  const { id, publicKey, transports: storedTransports, counter, ...rest } =
    credential;
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

export const getRpID = () => {
  const env = process.env.ENV;

  if (env === "local") {
    return "localhost";
  } else if (env === "prod") {
    return "in-study.xyz";
  } else {
    return null;
  }
};

export const generateRegisterOptions = async (optionsDto: WebauthnOptions) => {
  const { email, allowMultipleDevices } = optionsDto;
  let passkeys: NormalizedPasskey[] = [];

  const rpId = getRpID();
  if (!rpId) {
    throw fromException("Auth", "INVALID_ORIGIN");
  }

  if (allowMultipleDevices) {
    const contract = passkeyStorage.connect(relayer);
    const passkeysUrl = (await contract.getPasskeys(
      wallet(email).address
    )) as string[];
    const filteredUrls = passkeysUrl.filter((url): url is string =>
      Boolean(url)
    );
    if (filteredUrls.length === 0) {
      throw fromException("Auth", "NO_PASSKEY");
    }

    const rawPasskeys = await Promise.all(
      filteredUrls.map(async (url) => {
        const res = await fetch(url);
        return (await res.json()) as StoredPasskey;
      })
    );
    passkeys = rawPasskeys.map(reviveBuffers);
  }

  const options: PublicKeyCredentialCreationOptionsJSON =
    await generateRegistrationOptions({
      rpName: "InLabs",
      rpID: rpId,
      userName: email,
      userDisplayName: email,
      attestationType: "none",
      excludeCredentials: passkeys.map((passkey) => ({
        id: passkey.credential.idBase64Url,
        transports: passkey.credential.transports,
      })),
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

  const jwt = await issueRegistrationChallengeToken({
    challenge: options.challenge,
    email,
  });

  return { options, jwt };
};

export const verifyRegisterCredential = async (
  email: string,
  credential: RegistrationResponseJSON,
  challenge: string
) => {
  const userAddress = wallet(email).address;

  const verification: VerifiedRegistrationResponse =
    await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: challenge,
      expectedOrigin: [allowedOrigins.local, allowedOrigins.prod],
      expectedRPID: [rpIds.local, rpIds.prod],
      requireUserVerification: true,
    });

  const { verified, registrationInfo } = verification;
  if (!verified || !registrationInfo) {
    throw fromException("Auth", "FAILED_VERIFY_CREDENTIAL");
  }

  // registrationInfo를 s3에 저장
  const tokenUri = await putObject(
    `passkeys/${userAddress}/${registrationInfo.aaguid}.json`,
    JSON.stringify(registrationInfo, toBase64Replacer, 2),
    "application/json"
  );

  // 블록체인에 저장
  const contract = passkeyStorage.connect(relayer);
  const tx = await contract.registerPasskey(userAddress, tokenUri);
  const receipt = await tx.wait();
  if (!receipt?.status) {
    throw fromException("Auth", "FAILED_REGISTER_PASSKEY");
  }

  return verified;
};

export const generateAuthenticaterOptions = async (
  email: string,
  passkeysUrl: string[]
) => {
  const rpID = getRpID();
  if (!rpID) {
    throw fromException("Auth", "INVALID_ORIGIN");
  }

  const filteredUrls = passkeysUrl.filter((url): url is string => Boolean(url));
  if (filteredUrls.length === 0) {
    throw fromException("Auth", "NO_PASSKEY");
  }

  const rawPasskeys = await Promise.all(
    filteredUrls.map(async (url) => {
      const res = await fetch(url);
      return (await res.json()) as StoredPasskey;
    })
  );
  const passkeys = rawPasskeys.map(reviveBuffers);

  const allowCredentials = passkeys.map((pk) => ({
    id: pk.credential.idBase64Url,
    type: "public-key" as const,
    transports: pk.credential.transports,
  }));
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials,
    userVerification: "required",
    timeout: 60000,
  });

  const credentialIds = passkeys
    .map((pk) => pk.credential.idBase64Url)
    .filter((value): value is string => Boolean(value));

  if (credentialIds.length === 0) {
    throw fromException("Auth", "NO_PASSKEY");
  }

  const jwt = await issueAuthenticationChallengeToken({
    challenge: options.challenge,
    email,
    credentialIds,
  });

  return { options, jwt };
};

export const verifyAuthenticaterCredential = async (
  passkeysUrl: string[],
  credential: AuthenticationResponseJSON,
  challenge: string
) => {
  const filteredUrls = passkeysUrl.filter((url): url is string => Boolean(url));
  if (filteredUrls.length === 0) {
    throw fromException("Auth", "NO_PASSKEY");
  }

  const rawPasskeys = await Promise.all(
    filteredUrls.map(async (url) => {
      const res = await fetch(url);
      return (await res.json()) as StoredPasskey;
    })
  );
  const matchedPasskey = rawPasskeys.find(
    (pk) => pk.credential.id === credential.id
  );
  if (!matchedPasskey) {
    throw fromException("Auth", "FAILED_VERIFY_CREDENTIAL");
  }

  const passkey = reviveBuffers(matchedPasskey);

  const verification: VerifiedAuthenticationResponse =
    await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: challenge,
      expectedOrigin: [allowedOrigins.local, allowedOrigins.prod],
      expectedRPID: [rpIds.local, rpIds.prod],
      credential: {
        id: passkey.credential.id,
        publicKey: passkey.credential.publicKey,
        counter: passkey.credential.counter,
        transports: passkey.credential.transports,
      },
    });

  const { verified, authenticationInfo } = verification;
  if (!verified || !authenticationInfo) {
    throw fromException("Auth", "FAILED_VERIFY_CREDENTIAL");
  }

  return { verified };
};
