import { endpoints } from "@/app/api";
import { apiFetch } from "./apiClient";
import type { GoogleGeminiResponse } from "@/common/types";

export const btcAnalysis = async (prompt: string) => {
  try {
    return await apiFetch<GoogleGeminiResponse>(endpoints.gemini.root, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
  } catch (error) {
    if ((error as DOMException).name !== "AbortError") {
      return {
        message:
          error instanceof Error
            ? error.message
            : "시장 분석 중 오류가 발생했습니다.",
      };
    }
  }
};
