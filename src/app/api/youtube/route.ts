import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import {
  registerYouTubeVideo,
  type YouTubeVideoRegistration,
} from "@/server/modules/youtube/youtube.service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<
      YouTubeVideoRegistration
    >;

    const result = await registerYouTubeVideo({
      videoId: body.videoId ?? "",
      title: body.title,
      keyPoints: Array.isArray(body.keyPoints) ? body.keyPoints : [],
      note: body.note,
    });

    return NextResponse.json(result);
  } catch (error) {
    return createErrorResponse(error);
  }
}
