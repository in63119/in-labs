import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { apiClient } from "./apiClient";
import { endpoints } from "@/app/api";

// export const requestAuthentication = async (code: string) => {
//   try {
//     const res = await getRequestOptions(code);
//     if (!res.options) {
//       throw new Error(res.message ?? "인증 옵션을 가져오지 못했습니다.");
//     }

//     const credential = await startAuthentication({
//       optionsJSON: res.options,
//     });

//     return await authClient.verifyOptions(credential);
//   } catch (error: any) {
//     return {
//       error: true,
//       message: error.response.data.message,
//     };
//   }
// };

export const getRequestOptions = async (email: string) => {
  const response = await apiClient.get(`${endpoints.auth.option}`, {
    params: { email },
  });

  return response.data;
};
