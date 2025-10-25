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

const reviveBuffers = (passkey: any) => {
  const idSource = passkey?.credential?.id;
  if (typeof idSource !== "string") {
    return passkey;
  }
  const idBase64 = idSource;
  const transports = Array.isArray(passkey?.credential?.transports)
    ? passkey.credential.transports
    : [];
  const publicKeySource = passkey?.credential?.publicKey;
  const attestationSource = passkey?.attestationObject;
  const idBuffer = decodeBase64(idBase64);
  return {
    ...passkey,
    credential: {
      ...passkey.credential,
      id: idBuffer,
      idBase64,
      idBase64Url: bufferToBase64Url(idBuffer),
      publicKey:
        typeof publicKeySource === "string"
          ? decodeBase64(publicKeySource)
          : publicKeySource,
      transports,
    },
    attestationObject:
      typeof attestationSource === "string"
        ? decodeBase64(attestationSource)
        : attestationSource,
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
  let passkeys: any[] = []; // 이후에 패스키 저장하면 사용할 변수

  const rpId = getRpID();
  if (!rpId) {
    throw fromException("Auth", "INVALID_ORIGIN");
  }

  // Todo: 이미 등록된 패스키가 있을 때는 s3에서 불러오기

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
    // JSON.stringify(registrationInfo, toBase64Replacer, 2),
    JSON.stringify(registrationInfo),
    "application/json"
  );

  // 블록체인에 저장
  const contract = passkeyStorage.connect(relayer);
  const tx = await contract.registerPasskey(userAddress, tokenUri);
  await tx.wait(); // Todo: 성공, 실패에 따른 분기 처리

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
      return res.json();
    })
  );
  console.log("rawPasskeys", rawPasskeys);
  const passkeys = rawPasskeys.map(reviveBuffers);

  const allowCredentials = passkeys.map((pk) => ({
    id: pk.credential.idBase64Url,
    type: "public-key" as const,
    transports: pk.credential.transports as AuthenticatorTransportFuture[],
  }));
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials,
    userVerification: "required",
    timeout: 60000,
  });

  const credentialIds = passkeys
    .map((pk) => pk.credential.idBase64Url as string | undefined)
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
      return res.json();
    })
  );
  const matchedPasskey = rawPasskeys.find(
    (pk) => pk.credential.id === credential.id
  );
  if (!matchedPasskey) {
    throw fromException("Auth", "FAILED_VERIFY_CREDENTIAL");
  }

  const passkey = reviveBuffers(matchedPasskey);
  // console.log("passkey", passkey);

  console.log("id", passkey.credential.id);
  console.log("publicKey", passkey.credential.publickey);
  console.log("counter", passkey.credential.counter);
  console.log("transports", passkey.credential.transports);

  let verification: VerifiedAuthenticationResponse;
  /*
    Todo: credential에서 publickey 타입이 맞지 않아 계속 에러가 났음. 애초에 s3에 처음 저장할 때 데이터를 확인해봐야겠음

    // in-study 서버에서 패스키 저장하는 부분
    await this.passkeyService.save(
          {
            credentialId: registrationInfo.credential.id,
            publickey: Buffer.from(registrationInfo.credential.publicKey),
            counter: registrationInfo.credential.counter,
            transports: registrationInfo.credential.transports,
            fmt: registrationInfo.fmt,
            aaguid: registrationInfo.aaguid,
            user,
            deviceType: registrationInfo.credentialDeviceType,
            backedUp: registrationInfo.credentialBackedUp,
            lastUsed: new Date(),
          },
          manager,
        );
  */
  verification = await verifyAuthenticationResponse({
    response: credential,
    expectedChallenge: challenge,
    expectedOrigin: [allowedOrigins.local, allowedOrigins.prod],
    expectedRPID: [rpIds.local, rpIds.prod],
    credential: {
      id: passkey.credential.id,
      publicKey: passkey.credential.publickey,
      counter: passkey.credential.counter,
      transports: passkey.credential.transports,
    },
  });

  const { verified, authenticationInfo } = verification;
  if (!verified || !authenticationInfo) {
    throw fromException("Auth", "FAILED_VERIFY_CREDENTIAL");
  }

  console.log("authenticationInfo", authenticationInfo);

  return { verified, authenticationInfo };
};

// async verifyOptions(credential: AuthenticationCredentialDto) {
//   const challenge = JSON.parse(
//     Buffer.from(credential.response.clientDataJSON, 'base64url').toString(
//       'utf-8',
//     ),
//   ).challenge;
//   let verification: VerifiedAuthenticationResponse;

//   try {
//     return await this.userService.runInTransaction(async (manager) => {
//       const challenger = await this.challengeService.getChallenge(
//         challenge,
//         { createdAt: 'DESC' },
//         undefined,
//         manager,
//       );
//       if (!challenger) {
//         throw exceptions.Auth.INVALID_CHALLENGE;
//       }

//       const user = await this.userService.findOne(
//         {
//           id: Number(challenger.challengeUserId),
//         },
//         ['passkeys'],
//         manager,
//       );
//       if (!user || !user.passkeys) {
//         throw exceptions.User.USER_NOT_FOUND;
//       }

//       const passkey = user.passkeys.find(
//         (pk) => pk.credentialId === credential.id,
//       );
//       if (!passkey) {
//         throw exceptions.User.PASSKEY_NOT_FOUND;
//       }

//       verification = await verifyAuthenticationResponse({
//         response: credential,
//         expectedChallenge: challenger.challenge,
//         expectedOrigin: [allowedOrigins.local, allowedOrigins.prod],
//         expectedRPID: [rpId.local, rpId.prod],
//         credential: {
//           id: passkey.credentialId,
//           publicKey: passkey.publickey,
//           counter: passkey.counter,
//           transports: passkey.transports,
//         },
//       });

//       const { verified, authenticationInfo } = verification;
//       if (!verified || !authenticationInfo) {
//         throw exceptions.Auth.FAILED_VERIFY_CREDENTIAL;
//       }

//       await this.passkeyService.update(
//         passkey.id,
//         {
//           counter: authenticationInfo.newCounter,
//         },
//         manager,
//       );

//       await this.challengeService.deleteChallenge(challenger.id, manager);

//       const accessToken = this.accessJwtService.generate(user.id);

//       return {
//         verified,
//         accessToken,
//         userId: user.id,
//         kakaoId: user.kakaoId,
//       };
//     });
//   } catch (error) {
//     this.logger.error(
//       '[AuthService.verifyOptions]',
//       JSON.stringify(error.message),
//     );
//     throw exceptions.Auth.FAILED_VERIFY_CREDENTIAL;
//   }
// }
