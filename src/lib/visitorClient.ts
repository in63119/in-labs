import { endpoints } from "@/app/api";

export const trackVisitor = async (signal?: AbortSignal) => {
  try {
    const res = await fetch(endpoints.visitors.check, {
      method: "GET",
      signal: signal,
    });

    return res.json();
  } catch (error) {
    if ((error as DOMException).name !== "AbortError") {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "방문자 확인 중 오류가 발생했습니다.",
      };
    }
  }
};
