import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { apiClient } from "./apiClient";
import { endpoints } from "@/app/api";
import { WebauthnOptions } from "@/common/types";

export const authentication = async ({ email }: WebauthnOptions) => {
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

export const registration = async ({
  email,
  allowMultipleDevices,
}: WebauthnOptions) => {
  try {
    const registerOption = (
      await apiClient.post(`${endpoints.auth.registration.option}`, {
        email,
        allowMultipleDevices,
      })
    ).data;

    const credential = await startRegistration({
      optionsJSON: registerOption.options,
    });

    const registerVerify = (
      await apiClient.post(`${endpoints.auth.registration.verify}`, {
        credential,
      })
    ).data;

    return registerVerify;
  } catch (error: any) {
    return {
      error: true,
      message: error.response?.data?.message || "요청 중 오류가 발생했습니다.",
    };
  }
};
