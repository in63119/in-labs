import { endpoints } from "@/app/api";
import { apiFetch } from "./apiClient";
import {
  AddSubscriberResponse,
  SubscriberCountResponse,
} from "@/common/types";

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

export const getSubscriberCount = async () => {
  try {
    return await apiFetch<SubscriberCountResponse>(
      `${endpoints.subscriber.root}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "구독자 정보를 가져오는 중 오류가 발생했습니다.",
    };
  }
};
