import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { fromException } from "@/server/errors/exceptions";
import { verifyAuthenticationChallengeToken } from "@/server/modules/auth/token";
import { responseAuthenticationVerify } from "@/server/modules/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) ?? {};
    const { credential } = body;

    const token = request.cookies.get("webauthn-authentication")?.value;
    if (!token) {
      throw fromException("Auth", "MISSING_CHALLENGE_TOKEN");
    }

    const tokenPayload = await verifyAuthenticationChallengeToken(token).catch(
      () => {
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

    const verified = await responseAuthenticationVerify(
      email,
      credential,
      challenge
    );
    if (!verified) {
      throw fromException("Auth", "FAILED_VERIFY_CREDENTIAL");
    }

    return NextResponse.json({ ok: true, verified });
  } catch (error) {
    return createErrorResponse(error);
  }
}
