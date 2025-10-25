import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { isAxiosError } from "axios";
import { apiClient } from "./apiClient";
import { endpoints } from "@/app/api";
import { WebauthnOptions } from "@/common/types";

export const authentication = async ({ email }: WebauthnOptions) => {
  try {
    const resOptions = (
      await apiClient.post(`${endpoints.auth.authentication.option}`, {
        email,
      })
    ).data;

    const credential = await startAuthentication({
      optionsJSON: resOptions.options,
    });

    const resVerify = (
      await apiClient.post(`${endpoints.auth.authentication.verify}`, {
        credential,
      })
    ).data;

    return resVerify;
  } catch (error: unknown) {
    return {
      error: true,
      message: extractErrorMessage(error),
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
  } catch (error: unknown) {
    return {
      error: true,
      message: extractErrorMessage(error),
    };
  }
};

const extractErrorMessage = (error: unknown) => {
  const fallback = "요청 중 오류가 발생했습니다.";

  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
