import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createErrorResponse } from "@/server/errors/response";
import { responseAuthenticationOption } from "@/server/modules/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const { options, jwt } = await responseAuthenticationOption(email);

    const cookieStore = cookies();
    (await cookieStore).set("webauthn-authentication", jwt, {
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
