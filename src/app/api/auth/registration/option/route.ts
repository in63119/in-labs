import { NextRequest, NextResponse } from "next/server";
import { fromException } from "@/server/errors/exceptions";
import { createErrorResponse } from "@/server/errors/response";
import { generateRegisterOptions } from "@/server/modules/auth/webAuthn";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    const { options, jwt } = await generateRegisterOptions(requestBody);

    const cookieStore = cookies();
    const jar = await cookieStore;
    jar.set("webauthn-registration", jwt, {
      httpOnly: true,
      maxAge: 120,
      sameSite: "lax",
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
