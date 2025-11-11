import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import {
  getVisitorCount,
  upsertVisitor,
} from "@/server/modules/visitor/visitor.service";

const getClientIp = (request: NextRequest, fallback?: string | null) => {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    (request as unknown as { ip?: string }).ip ??
    fallback ??
    null
  );
};

export async function GET() {
  try {
    return NextResponse.json({ ok: true, count: getVisitorCount() });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { ip?: string | null }
      | null;

    const ip = getClientIp(request, body?.ip ?? null);

    if (!ip) {
      return NextResponse.json(
        {
          ok: false,
          message: "방문자 IP를 확인할 수 없습니다.",
        },
        { status: 400 }
      );
    }

    const record = upsertVisitor(ip);
    return NextResponse.json({ ok: true, visitor: record });
  } catch (error) {
    return createErrorResponse(error);
  }
}
