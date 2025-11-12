import "server-only";
import { fromException } from "@/server/errors/exceptions";

const YOUTUBE_ID_REGEX = /^[\w-]{11}$/;

export type YouTubeVideoRegistration = {
  videoId: string;
  title?: string;
  keyPoints?: string[];
  note?: string;
};

export const registerYouTubeVideo = async (
  payload: YouTubeVideoRegistration
) => {
  const { videoId, title, keyPoints = [], note } = payload;

  if (!videoId || !YOUTUBE_ID_REGEX.test(videoId)) {
    throw fromException("YouTube", "INVALID_VIDEO_ID");
  }

  // TODO: Connect to smart contract integration.
  return {
    ok: true as const,
    videoId,
    title,
    keyPoints,
    note,
  };
};
