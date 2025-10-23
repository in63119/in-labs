import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  AuthenticatorTransportFuture,
  VerifiedAuthenticationResponse,
} from "@simplewebauthn/server";
import { WebauthnOptions } from "@/common/types";
import { fromException } from "@/server/errors/exceptions";
import { issueChallengeToken } from "./token";

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
        id: passkey.credentialId,
        transports: passkey.transports,
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
