import { NextRequest, NextResponse } from "next/server";
import { fromException } from "@/server/errors/exceptions";
import { createErrorResponse } from "@/server/errors/response";
import { getRpID } from "@/server/modules/auth/webAuthn";

export async function POST(request: NextRequest) {
  const rpId = getRpID();
  if (!rpId) {
    throw fromException("Auth", "INVALID_ORIGIN");
  }

  try {
    const { email } = await request.json();

    // Todo: 현재는 바로 오류 응답. 나중에 이메일 유무확인
    if (email) {
      throw fromException("User", "USER_NOT_FOUND");
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
