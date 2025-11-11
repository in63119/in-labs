import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import {
  getVisitorCount,
  getClientIp,
  visit,
} from "@/server/modules/visitor/visitor.service";
import { fromException } from "@/server/errors/exceptions";

export async function GET() {
  try {
    return NextResponse.json({
      count: Number(await getVisitorCount()),
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedIp = searchParams.get("ip");
    const ip = getClientIp(request, requestedIp);
    if (!ip) {
      throw fromException("Visitor", "INVALID_IP");
    }

    await visit(ip);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
