import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { fromException } from "@/server/errors/exceptions";
import { verifyRegistrationChallengeToken } from "@/server/modules/auth/token";
import { responseRegistrationVerify } from "@/server/modules/auth/auth.service";
import { RegistrationRequest } from "@/common/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) ?? {};
    const { credential, device, os, allowMultipleDevices } =
      body as RegistrationRequest;

    const token = request.cookies.get("webauthn-registration")?.value;
    if (!token) {
      throw fromException("Auth", "MISSING_CHALLENGE_TOKEN");
    }

    const tokenPayload = await verifyRegistrationChallengeToken(token).catch(
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

    const verified = await responseRegistrationVerify(
      { email, device, os, allowMultipleDevices },
      credential,
      challenge
    );

    return NextResponse.json({ ok: true, verified });
  } catch (error) {
    return createErrorResponse(error);
  }
}
