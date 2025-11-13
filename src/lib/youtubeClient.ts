import { endpoints } from "@/app/api";
import { apiFetch } from "./apiClient";
import type {
  VideoForm,
  SaveVideoResponse,
  LoadVideoResponse,
  EditVideoResponse,
  DeleteVideoResponse,
} from "@/common/types";

export const saveVideo = async (video: VideoForm) => {
  try {
    return await apiFetch<SaveVideoResponse>(endpoints.youtube.root, {
      method: "POST",
      body: {
        ...video,
      },
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "영상을 저장하는 중 오류가 발생했습니다.",
    };
  }
};

export const loadVideo = async () => {
  try {
    return (
      (
        await apiFetch<LoadVideoResponse>(endpoints.youtube.root, {
          method: "GET",
        })
      ).videos ?? []
    );
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "영상을 불러오는 중 오류가 발생했습니다.",
    };
  }
};

export const editVideo = async (video: VideoForm) => {
  try {
    return await apiFetch<EditVideoResponse>(endpoints.youtube.root, {
      method: "PUT",
      body: {
        ...video,
      },
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "영상을 수정하는 중 오류가 발생했습니다.",
    };
  }
};

export const deleteVideo = async (videoId: string) => {
  try {
    return await apiFetch<DeleteVideoResponse>(
      `${endpoints.youtube.root}/${videoId}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "영상을 삭제하는 중 오류가 발생했습니다.",
    };
  }
};
