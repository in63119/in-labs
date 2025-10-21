import { NextRequest, NextResponse } from "next/server";

type AdminLog = {
  id: string;
  createdAt: string;
  level: "info" | "warn" | "error";
  message: string;
};

// 임시 데이터 저장소 (배포 환경에선 DB 또는 KV 스토어 사용)
const logs: AdminLog[] = [];

export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get("level");

  const filteredLogs = level
    ? logs.filter((log) => log.level === level)
    : logs;

  return NextResponse.json({
    ok: true,
    count: filteredLogs.length,
    logs: filteredLogs,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.message !== "string") {
    return NextResponse.json(
      { ok: false, error: "message 필드가 필요합니다." },
      { status: 400 },
    );
  }

  const log: AdminLog = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    level: ["info", "warn", "error"].includes(body.level)
      ? body.level
      : "info",
    message: body.message,
  };

  logs.unshift(log);

  return NextResponse.json({ ok: true, log }, { status: 201 });
}
