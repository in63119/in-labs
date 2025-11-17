import { endpoints } from "@/app/api";
import { apiFetch } from "./apiClient";
import { AddSubscriberResponse } from "@/common/types";

export const subscribe = async (email: string) => {
  try {
    return await apiFetch<AddSubscriberResponse>(
      `${endpoints.subscriber.root}`,
      {
        method: "POST",
        body: {
          email,
        },
      }
    );
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "구독자 추가 중 오류가 발생했습니다.",
    };
  }
};
