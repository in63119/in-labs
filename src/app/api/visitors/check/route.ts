import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import {
  getClientIp,
  hasVisited,
} from "@/server/modules/visitor/visitor.service";
import { fromException } from "@/server/errors/exceptions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedIp = searchParams.get("ip");
    const ip = getClientIp(request, requestedIp);

    if (!ip) {
      throw fromException("Visitor", "INVALID_IP");
    }

    const visited = await hasVisited(ip);

    return NextResponse.json({ visited });
  } catch (error) {
    return createErrorResponse(error);
  }
}
