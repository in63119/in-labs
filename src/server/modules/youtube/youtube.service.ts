import "server-only";
import { fromException } from "@/server/errors/exceptions";
import type { VideoForm, YouTubeVideo, RawVideoTuple } from "@/common/types";
import { wallet, youtubeStorage } from "@/lib/ethersClient";
import { getAdminCode } from "@/server/modules/auth/auth.service";

export const save = async ({ videoId, title, keyPoints }: VideoForm) => {
  try {
    const address = await wallet(getAdminCode()).getAddress();
    const saveVideoFor = await youtubeStorage.saveVideoFor(
      address,
      videoId,
      title,
      keyPoints
    );
    const receipt = await saveVideoFor.wait();
    const event = receipt.logs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((log: any) => youtubeStorage.interface.parseLog(log))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find((parsed: any) => parsed?.name === "VideoStored");
    if (!event) {
      throw fromException("YouTube", "FAILED_SAVE_VIDEO");
    }
  } catch {
    throw fromException("YouTube", "FAILED_SAVE_VIDEO");
  }
};

const normalizeVideos = (rawVideos: RawVideoTuple[]): YouTubeVideo[] => {
  return rawVideos.map(([videoId, title, keyPoints]) => ({
    id: videoId,
    title,
    keyPoints,
  }));
};

export const load = async () => {
  try {
    const address = await wallet(getAdminCode()).getAddress();
    const videos = (await youtubeStorage.getVideos(address)) as RawVideoTuple[];

    return normalizeVideos(videos);
  } catch {
    throw fromException("YouTube", "FAILED_LOAD_VIDEO");
  }
};

export const edit = async ({ videoId, title, keyPoints }: VideoForm) => {
  try {
    const address = await wallet(getAdminCode()).getAddress();
    const saveVideoFor = await youtubeStorage.updateVideoFor(
      address,
      videoId,
      title,
      keyPoints
    );
    const receipt = await saveVideoFor.wait();
    const event = receipt.logs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((log: any) => youtubeStorage.interface.parseLog(log))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find((parsed: any) => parsed?.name === "VideoUpdated");
    if (!event) {
      throw fromException("YouTube", "FAILED_SAVE_VIDEO");
    }
  } catch {
    throw fromException("YouTube", "FAILED_SAVE_VIDEO");
  }
};

export const remove = async (videoId: string) => {
  try {
    const address = await wallet(getAdminCode()).getAddress();
    const deleteVideoFor = await youtubeStorage.deleteVideoFor(
      address,
      videoId
    );
    const receipt = await deleteVideoFor.wait();
    const event = receipt.logs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((log: any) => youtubeStorage.interface.parseLog(log))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find((parsed: any) => parsed?.name === "VideoDeleted");
    if (!event) {
      throw fromException("YouTube", "FAILED_DELETE_VIDEO");
    }
  } catch {
    throw fromException("YouTube", "FAILED_DELETE_VIDEO");
  }
};
