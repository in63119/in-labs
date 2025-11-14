import { endpoints } from "@/app/api";
import { apiFetch } from "./apiClient";
import { PinResponse } from "@/common/types";

export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return false;
  return emailPattern.test(email.trim());
};

export const pinEmail = async (email: string) => {
  try {
    // const query = new URLSearchParams({ email: email.trim() });

    return await apiFetch<PinResponse>(`${endpoints.email.pin}`, {
      method: "POST",
      body: {
        email,
      },
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "이메일 인증 중 오류가 발생했습니다.",
    };
  }
};
