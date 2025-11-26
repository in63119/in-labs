import { endpoints } from "@/app/api";
import { apiFetch } from "./apiClient";
import {
  CheckVisitorResponse,
  VisitorCountResponse,
  VisitResponse,
  VisitorLog,
} from "@/common/types";

const VISIT_STORAGE_KEY = "inlabs:visit:today";

const todayKey = () => new Date().toISOString().slice(0, 10);

const markVisitedToday = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(VISIT_STORAGE_KEY, todayKey());
};

export const hasVisitFlag = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return window.sessionStorage.getItem(VISIT_STORAGE_KEY) === todayKey();
};

export const trackVisitor = async (signal?: AbortSignal) => {
  try {
    return await apiFetch<CheckVisitorResponse>(endpoints.visitors.check, {
      method: "GET",
      signal,
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

export const visit = async (signal: AbortSignal, url: string) => {
  try {
    return await apiFetch<VisitResponse>(endpoints.visitors.root, {
      method: "POST",
      signal,
      body: { url },
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

export const ensureVisit = async (signal: AbortSignal, url: string) => {
  if (hasVisitFlag()) {
    return { visited: true };
  }

  const response = await trackVisitor(signal);
  if (!response || "message" in response) {
    return response;
  }

  if (!response.visited) {
    const visitResult = await visit(signal, url);
    if (visitResult && "message" in visitResult) {
      return visitResult;
    }
  }

  markVisitedToday();
  return { visited: true };
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

export const getVisitorLogs = async (limit = 50) => {
  try {
    return await apiFetch<{ visits: VisitorLog[] } | { message: string }>(
      `${endpoints.visitors.logs}?limit=${encodeURIComponent(limit)}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "방문자 로그 구하는 중 오류가 발생했습니다.",
    };
  }
};
