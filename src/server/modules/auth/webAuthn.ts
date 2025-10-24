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

export const allowedOrigins = {
  local: "http://localhost:3000",
  prod: "https://in-study.xyz",
};
export const rpIds = {
  local: "localhost",
  prod: "in-study.xyz",
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

export const verifyRegisterCredential = async (
  credential: RegistrationCredentialDto,
  challenge: string
) => {
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

  // Todo: registrationInfo를 s3에 저장하는 로직 추가

  // return await this.userService.runInTransaction(async (manager) => {
  //   const user: UserEntity = await this.userService.save(
  //     { name: userName, kakaoId },
  //     manager
  //   );
  //   await this.passkeyService.save(
  //     {
  //       credentialId: registrationInfo.credential.id,
  //       publickey: Buffer.from(registrationInfo.credential.publicKey),
  //       counter: registrationInfo.credential.counter,
  //       transports: registrationInfo.credential.transports,
  //       fmt: registrationInfo.fmt,
  //       aaguid: registrationInfo.aaguid,
  //       user,
  //       deviceType: registrationInfo.credentialDeviceType,
  //       backedUp: registrationInfo.credentialBackedUp,
  //       lastUsed: new Date(),
  //     },
  //     manager
  //   );
  //   await this.challengeService.deleteChallenge(challenge.id);
  //   const accessToken = this.accessJwtService.generate(user.id);
  //   return { accessToken: accessToken, userId: user.id };
  // });
};
