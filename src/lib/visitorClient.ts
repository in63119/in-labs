import { endpoints } from "@/app/api";
import { apiFetch } from "./apiClient";
import { CheckVisitorResponse, VisitorCountResponse } from "@/common/types";

export const trackVisitor = async (signal: AbortSignal) => {
  try {
    return await apiFetch<CheckVisitorResponse>(endpoints.visitors.check, {
      method: "GET",
      signal: signal,
    });
  } catch (error) {
    if ((error as DOMException).name !== "AbortError") {
      return {
        message:
          error instanceof Error
            ? error.message
            : "방문자 확인 중 오류가 발생했습니다.",
      };
    }
  }
};

export const visit = async (signal: AbortSignal) => {
  try {
    return await apiFetch(endpoints.visitors.root, {
      method: "POST",
      signal: signal,
    });
  } catch (error) {
    if ((error as DOMException).name !== "AbortError") {
      return {
        message:
          error instanceof Error
            ? error.message
            : "방문 중 오류가 발생했습니다.",
      };
    }
  }
};

export const getVisitorCount = async () => {
  try {
    return await apiFetch<VisitorCountResponse | { message: string }>(
      endpoints.visitors.root,
      {
        method: "GET",
      }
    );
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "방문자 수 구하는 중 오류가 발생했습니다.",
    };
  }
};
