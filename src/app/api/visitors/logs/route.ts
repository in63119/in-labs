import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { getVisitLogs } from "@/server/modules/visitor/visitor.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 50;
    const safeLimit = Number.isNaN(limit) ? 50 : Math.max(1, Math.min(200, limit));

    const visits = await getVisitLogs(safeLimit);
    return NextResponse.json({ visits });
  } catch (error) {
    return createErrorResponse(error);
  }
}
