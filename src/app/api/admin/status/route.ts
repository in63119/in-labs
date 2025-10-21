import { NextResponse } from "next/server";

export async function GET() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const pkConfigured = Boolean(process.env.ADMIN_PRIVATE_KEY);

  return NextResponse.json({
    ok: true,
    adminUser: username,
    privateKeyConfigured: pkConfigured,
    timestamp: new Date().toISOString(),
  });
}
