import { NextResponse } from "next/server";

import { createErrorResponse } from "@/server/errors/response";
import { validateGmailRefreshToken } from "@/server/modules/google/config";

export async function GET() {
  try {
    const valid = await validateGmailRefreshToken();
    return NextResponse.json({ ok: true, valid });
  } catch (error) {
    return createErrorResponse(error);
  }
}
