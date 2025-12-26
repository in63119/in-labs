import { endpoints } from "@/app/api";
import { apiFetch } from "./apiClient";
import type { GoogleTokenStatusResponse } from "@/common/types";

export const tokenStatus = async () => {
  try {
    return await apiFetch<GoogleTokenStatusResponse>(endpoints.google.status, {
      method: "GET",
    });
  } catch (error) {
    if ((error as DOMException).name !== "AbortError") {
      return {
        message:
          error instanceof Error
            ? error.message
            : "토큰 상태를 확인하지 못했습니다.",
      };
    }
  }
};
