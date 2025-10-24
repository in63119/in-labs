import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { randomUUID } from "crypto";
import { tokenStore } from "@/server/stores/tokenStore";

const secret = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH
);

export async function issueChallengeToken(payload: {
  challenge: string;
  email: string;
}) {
  const jti = randomUUID();
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(secret);

  await tokenStore.store(jti, { used: false, expiresAt: Date.now() + 120_000 });

  return token;
}

export async function verifyChallengeToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  const jti = payload.jti;
  if (!jti) throw new Error("invalid token");

  const record = await tokenStore.take(jti);
  if (!record || record.used) throw new Error("token already used or expired");

  await tokenStore.markUsed(jti);
  return payload;
}
