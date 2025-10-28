import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { fromException } from "@/server/errors/exceptions";
import { verifyAuthenticationChallengeToken } from "@/server/modules/auth/token";
import { verifyAuthenticaterCredential } from "@/server/modules/auth/webAuthn";
import { passkeyStorage, relayer, wallet } from "@/lib/ethersClient";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) ?? {};
    const { credential } = body;

    const token = request.cookies.get("webauthn-authentication")?.value;
    if (!token) {
      throw fromException("Auth", "MISSING_CHALLENGE_TOKEN");
    }

    const tokenPayload = await verifyAuthenticationChallengeToken(token).catch(
      (err) => {
        console.error(err);
        throw fromException("Auth", "INVALID_CHALLENGE_TOKEN");
      }
    );

    const challenge =
      typeof tokenPayload.challenge === "string"
        ? tokenPayload.challenge
        : null;
    const email =
      typeof tokenPayload.email === "string" ? tokenPayload.email : null;
    if (!challenge || !email) {
      throw fromException("Auth", "INVALID_CHALLENGE_TOKEN");
    }

    const userAddress = wallet(email).address;
    const contract = passkeyStorage.connect(relayer);
    const balanceOfPasskeys = Number(await contract.balanceOf(userAddress));
    if (balanceOfPasskeys === 0) {
      throw fromException("User", "USER_NOT_FOUND");
    }

    const passkeys = await contract.getPasskeys(userAddress);
    const verification = await verifyAuthenticaterCredential(
      passkeys,
      credential,
      challenge
    );

    const { verified } = verification;

    return NextResponse.json({ ok: true, verified });
  } catch (error) {
    return createErrorResponse(error);
  }
}
