import { NextRequest, NextResponse } from "next/server";

import { fromException } from "@/server/errors/exceptions";
import { createErrorResponse } from "@/server/errors/response";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    // Todo: 현재는 바로 오류 응답. 나중에 이메일 유무확인
    if (email) {
      throw fromException("Auth", "MISSING_EMAIL_PARAM");
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// export async function POST(request: NextRequest) {
//   const body = await request.json().catch(() => null);

//   if (!body || typeof body.message !== "string") {
//     return NextResponse.json(
//       { ok: false, error: "message 필드가 필요합니다." },
//       { status: 400 }
//     );
//   }

//   const log: AdminLog = {
//     id: crypto.randomUUID(),
//     createdAt: new Date().toISOString(),
//     level: ["info", "warn", "error"].includes(body.level) ? body.level : "info",
//     message: body.message,
//   };

//   logs.unshift(log);

//   return NextResponse.json({ ok: true, log }, { status: 201 });
// }
