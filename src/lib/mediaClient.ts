import { endpoints } from "@/app/api";

export type UploadImageResponse =
  | {
      ok: true;
      url: string;
      message?: string;
    }
  | {
      ok: false;
      message: string;
    };

export const uploadImage = async (
  formData: FormData
): Promise<UploadImageResponse> => {
  try {
    const response = await fetch(endpoints.media.upload, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = (await response.json().catch(() => null)) as
      | {
          ok?: boolean;
          url?: string;
          message?: string;
        }
      | null;

    if (!response.ok || !data?.ok || !data.url) {
      return {
        ok: false,
        message:
          data?.message ?? "이미지 업로드에 실패했습니다. 다시 시도하세요.",
      };
    }

    return {
      ok: true,
      url: data.url,
      message: data.message,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "이미지 업로드 중 오류가 발생했습니다.",
    };
  }
};
