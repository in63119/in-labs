import { NextRequest, NextResponse } from "next/server";
import { fromException } from "@/server/errors/exceptions";
import { createErrorResponse } from "@/server/errors/response";
import { cookies } from "next/headers";
import { responseRegistrationOption } from "@/server/modules/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) ?? {};
    const { email, allowMultipleDevices = false } = body;
    if (typeof email !== "string" || email.length === 0) {
      throw fromException("Auth", "MISSING_EMAIL");
    }

    const { options, jwt } = await responseRegistrationOption({
      email,
      allowMultipleDevices,
    });

    const cookieStore = cookies();
    (await cookieStore).set("webauthn-registration", jwt, {
      httpOnly: true,
      maxAge: 120,
      sameSite: "lax",
    });

    return NextResponse.json({
      ok: true,
      options,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
