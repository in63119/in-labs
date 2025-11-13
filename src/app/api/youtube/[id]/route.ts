import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { remove } from "@/server/modules/youtube/youtube.service";
import { fromException } from "@/server/errors/exceptions";

type Params = {
  params: Promise<{
    id?: string;
  }>;
};

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const resolvedParams = await params;
    const videoId = resolvedParams.id?.trim();
    if (!videoId) {
      throw fromException("YouTube", "INVALID_REQUEST");
    }

    console.log("videoId", videoId);

    await remove(videoId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
