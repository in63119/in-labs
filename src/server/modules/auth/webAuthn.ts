import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import { fromException } from "@/server/errors/exceptions";
import { NormalizedPasskey } from "@/common/types";

export const allowedOrigins = {
  local: "http://localhost:3000",
  prod: "https://in-study.xyz",
};
export const rpIds = {
  local: "localhost",
  prod: "in-study.xyz",
};

export const generateRegisterOptions = async (
  rpId: string,
  email: string,
  passkeys: NormalizedPasskey[]
) => {
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

  return options;
};

export const verifyRegisterCredential = async (
  credential: RegistrationResponseJSON,
  challenge: string
) => {
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

  return verification;
};

export const generateAuthenticaterOptions = async (
  rpID: string,
  passkeys: NormalizedPasskey[]
) => {
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

  return options;
};

export const verifyAuthenticaterCredential = async (
  passkey: NormalizedPasskey,
  credential: AuthenticationResponseJSON,
  challenge: string
) => {
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

  return verified;
};
