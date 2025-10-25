import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";
import { tokenStore } from "@/server/stores/tokenStore";

const secret = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH
);

type ChallengePurpose = "registration" | "authentication";

export type ChallengeTokenPayload = {
  purpose: ChallengePurpose;
  challenge: string;
  email: string;
  credentialIds?: string[];
};

const CHALLENGE_TTL_MS = 120_000;

const issueToken = async (payload: ChallengeTokenPayload) => {
  const jti = randomUUID();
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${Math.floor(CHALLENGE_TTL_MS / 1000)}s`)
    .sign(secret);

  await tokenStore.store(jti, {
    used: false,
    expiresAt: Date.now() + CHALLENGE_TTL_MS,
  });

  return token;
};

const verifyToken = async (token: string, purpose: ChallengePurpose) => {
  const { payload } = await jwtVerify(token, secret);
  const jti = payload.jti;
  if (!jti || payload.purpose !== purpose) {
    throw new Error("invalid token");
  }

  const record = await tokenStore.take(jti);
  if (!record || record.used) throw new Error("token already used or expired");

  await tokenStore.markUsed(jti);
  return payload as ChallengeTokenPayload;
};

export const issueRegistrationChallengeToken = async ({
  challenge,
  email,
}: {
  challenge: string;
  email: string;
}) =>
  issueToken({
    purpose: "registration",
    challenge,
    email,
  });

export const verifyRegistrationChallengeToken = async (token: string) =>
  verifyToken(token, "registration");

export const issueAuthenticationChallengeToken = async ({
  challenge,
  email,
  credentialIds,
}: {
  challenge: string;
  email: string;
  credentialIds: string[];
}) =>
  issueToken({
    purpose: "authentication",
    challenge,
    email,
    credentialIds,
  });

export const verifyAuthenticationChallengeToken = async (token: string) =>
  verifyToken(token, "authentication");
