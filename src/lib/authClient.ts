import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { apiClient } from "./apiClient";
import { endpoints } from "@/app/api";
import { WebauthnOptions } from "@/common/types";

export const authenticationOption = async ({ email }: WebauthnOptions) => {
  try {
    const response = await apiClient.post(
      `${endpoints.auth.authentication.option}`,
      {
        email,
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      error: true,
      message: error.response?.data?.message || "요청 중 오류가 발생했습니다.",
    };
  }
};

export const registrationOption = async ({
  email,
  allowMultipleDevices,
}: WebauthnOptions) => {
  try {
    const response = await apiClient.post(
      `${endpoints.auth.registration.option}`,
      {
        email,
        allowMultipleDevices,
      }
    );

    return response.data;
  } catch (error: any) {
    return {
      error: true,
      message: error.response?.data?.message || "요청 중 오류가 발생했습니다.",
    };
  }
};
