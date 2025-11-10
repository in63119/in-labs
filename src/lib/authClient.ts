import {
  startAuthentication,
  startRegistration,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";
import { endpoints } from "@/app/api";
import { Device, OS } from "@/common/enums";
import {
  RequestWebauthnOptions,
  DeviceInfoLike,
  PasskeySummary,
} from "@/common/types";
import { ApiError, apiFetch } from "./apiClient";

const DEVICE_MAP: Record<string, Device> = {
  mobile: Device.Mobile,
  phone: Device.Mobile,
  smartphone: Device.Mobile,
  tablet: Device.Tablet,
  desktop: Device.Desktop,
  laptop: Device.Desktop,
};

const OS_MAP: Record<string, OS> = {
  windows: OS.Windows,
  macos: OS.MacOS,
  "mac os": OS.MacOS,
  android: OS.Android,
  ios: OS.iOS,
  linux: OS.Linux,
  unknown: OS.Others,
};

export const authentication = async ({ email }: RequestWebauthnOptions) => {
  try {
    const resOptions = await apiFetch<{
      ok: boolean;
      options: PublicKeyCredentialRequestOptionsJSON;
    }>(`${endpoints.auth.authentication.option}`, {
      method: "POST",
      body: {
        email,
      },
    });

    const credential = await startAuthentication({
      optionsJSON: resOptions.options,
    });

    const resVerify = await apiFetch<{
      ok: boolean;
      verified: boolean;
    }>(`${endpoints.auth.authentication.verify}`, {
      method: "POST",
      body: {
        credential,
      },
    });

    return resVerify;
  } catch (error: unknown) {
    return {
      error: true,
      message: extractErrorMessage(error),
    };
  }
};

export const toDeviceEnum = (
  info: DeviceInfoLike | null | undefined
): Device => {
  const label = info?.deviceType?.toLowerCase();
  if (!label) {
    return Device.Desktop;
  }
  return DEVICE_MAP[label] ?? Device.Desktop;
};

export const toOsEnum = (info: DeviceInfoLike | null | undefined): OS => {
  const label = info?.os?.toLowerCase();
  if (!label) {
    return OS.Others;
  }
  return OS_MAP[label] ?? OS.Others;
};

export const registration = async ({
  email,
  device,
  os,
  allowMultipleDevices,
}: RequestWebauthnOptions) => {
  try {
    const registerOption = await apiFetch<{
      ok: boolean;
      options: PublicKeyCredentialCreationOptionsJSON;
    }>(`${endpoints.auth.registration.option}`, {
      method: "POST",
      body: {
        email,
        allowMultipleDevices,
      },
    });

    const credential = await startRegistration({
      optionsJSON: registerOption.options,
    });

    const registerVerify = await apiFetch<{
      ok: boolean;
      verified: boolean;
    }>(`${endpoints.auth.registration.verify}`, {
      method: "POST",
      body: {
        credential,
        device,
        os,
        allowMultipleDevices,
      },
    });

    return registerVerify;
  } catch (error: unknown) {
    return {
      error: true,
      message: extractErrorMessage(error),
    };
  }
};

type PasskeyListResponse = {
  ok: boolean;
  passkeys: PasskeySummary[];
};

export const fetchPasskeys = async (adminCode: string) => {
  return await apiFetch<PasskeyListResponse>(endpoints.auth.passkeys, {
    method: "POST",
    body: { adminCode },
  });
};

const extractErrorMessage = (error: unknown) => {
  const fallback = "요청 중 오류가 발생했습니다.";

  if (error instanceof ApiError) {
    if (
      typeof error.data === "object" &&
      error.data !== null &&
      "message" in error.data
    ) {
      return String((error.data as { message?: unknown }).message ?? fallback);
    }
    return error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
