import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { fromException } from "@/server/errors/exceptions";
import { verifyChallengeToken } from "@/server/modules/auth/token";
import { verifyRegisterCredential } from "@/server/modules/auth/webAuthn";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) ?? {};
    const { credential } = body;

    const token = request.cookies.get("webauthn-registration")?.value;
    if (!token) {
      throw fromException("Auth", "MISSING_CHALLENGE_TOKEN");
    }

    let tokenPayload;
    try {
      tokenPayload = await verifyChallengeToken(token);
    } catch {
      throw fromException("Auth", "INVALID_CHALLENGE_TOKEN");
    }

    const challenge =
      typeof tokenPayload.challenge === "string"
        ? tokenPayload.challenge
        : null;

    if (!challenge) {
      throw fromException("Auth", "INVALID_CHALLENGE_TOKEN");
    }

    const verification = await verifyRegisterCredential(credential, challenge);
    console.log("verification", verification);

    // token을 검증한 뒤 credential 처리 진행
    return NextResponse.json({ ok: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
