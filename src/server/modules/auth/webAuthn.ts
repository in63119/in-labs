import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  AuthenticatorTransportFuture,
  VerifiedAuthenticationResponse,
} from "@simplewebauthn/server";
import { WebauthnOptions, RegistrationCredentialDto } from "@/common/types";
import { fromException } from "@/server/errors/exceptions";
import { issueChallengeToken } from "./token";
import { PasskeyStorage, relayer, wallet } from "@/lib/ethersClient";
import { putObject } from "@/server/modules/aws/s3";

export const allowedOrigins = {
  local: "http://localhost:3000",
  prod: "https://in-study.xyz",
};
export const rpIds = {
  local: "localhost",
  prod: "in-study.xyz",
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
  let passkeys: any[] = []; // 이후에 패스키 저장하면 사용할 변수

  const rpId = getRpID();
  if (!rpId) {
    throw fromException("Auth", "INVALID_ORIGIN");
  }

  // const user = await this.userService.findOne({ kakaoId });
  // if (user && allowMultipleDevices) {
  //   passkeys = await this.passkeyService.passkeysByUserId(user.id);
  // } else if (user && !allowMultipleDevices) {
  //   throw exceptions.Auth.ALREADY_REGISTERED(user.name);
  // }

  const options: PublicKeyCredentialCreationOptionsJSON =
    await generateRegistrationOptions({
      rpName: "InLabs",
      rpID: rpId,
      userName: email,
      userDisplayName: email,
      attestationType: "none",
      excludeCredentials: passkeys.map((passkey) => ({
        id: passkey.credential.id,
        transports: passkey.credential.transports,
      })),
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

  const jwt = await issueChallengeToken({
    challenge: options.challenge,
    email,
  });

  return { options, jwt };
};

export const verifyRegisterCredential = async (
  email: string,
  credential: RegistrationCredentialDto,
  challenge: string
) => {
  const userAddress = wallet(email).address;

  let verification: VerifiedRegistrationResponse;
  verification = await verifyRegistrationResponse({
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
  const passkeyStorage = PasskeyStorage.connect(relayer);
  const tx = await passkeyStorage.registerPasskey(userAddress, tokenUri);
  await tx.wait();

  return verified;
};
