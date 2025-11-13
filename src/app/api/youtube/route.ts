import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { save, load, edit } from "@/server/modules/youtube/youtube.service";
import type { VideoForm } from "@/common/types";
import { fromException } from "@/server/errors/exceptions";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as VideoForm | null;
    if (!body) {
      throw fromException("YouTube", "INVALID_REQUEST");
    }

    await save(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function GET() {
  try {
    const videos = await load();

    return NextResponse.json({ videos });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as VideoForm | null;
    if (!body) {
      throw fromException("YouTube", "INVALID_REQUEST");
    }

    await edit(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
