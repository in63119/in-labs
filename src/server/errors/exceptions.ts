import "server-only";

import AppError, { AppErrorOptions } from "./AppError";

const define = <TPayload = unknown>(options: AppErrorOptions<TPayload>) =>
  options;

export const exceptions = {
  System: {
    ADMIN_AUTH_CODE_HASH_NOT_FOUND: define({
      code: "ADMIN_AUTH_CODE_HASH_NOT_FOUND",
      message: "시스템 초기화에 실패하였습니다.",
      status: 500,
    }),
  },
  User: {
    USER_NOT_FOUND: define({
      code: "USER_NOT_FOUND",
      message: "사용자를 찾을 수 없습니다.",
      status: 404,
    }),
  },
  Auth: {
    INVALID_AUTH_CODE: define({
      code: "INVALID_AUTH_CODE",
      message: "유효하지 않은 관리자 코드입니다.",
      status: 400,
    }),
    INVALID_ORIGIN: define({
      code: "INVALID_ORIGIN",
      message: "유효하지 않은 출처입니다.",
      status: 400,
    }),
    MISSING_EMAIL: define({
      code: "MISSING_EMAIL",
      message: "email 값이 필요합니다.",
      status: 400,
    }),
    MISSING_CHALLENGE_TOKEN: define({
      code: "MISSING_CHALLENGE_TOKEN",
      message: "챌린지 토큰이 필요합니다.",
      status: 400,
    }),
    INVALID_CHALLENGE_TOKEN: define({
      code: "INVALID_CHALLENGE_TOKEN",
      message: "유효하지 않은 챌린지 토큰입니다.",
      status: 400,
    }),
    NO_PASSKEY: define({
      code: "NO_PASSKEY",
      message: "등록된 패스키가 없습니다.",
      status: 404,
    }),
    FAILED_VERIFY_CREDENTIAL: define({
      code: "FAILED_VERIFY_CREDENTIAL",
      message: "자격 증명 검증에 실패했습니다.",
      status: 400,
    }),
    FAILED_REGISTER_PASSKEY: define({
      code: "FAILED_REGISTER_PASSKEY",
      message: "패스키 등록에 실패했습니다.",
      status: 500,
    }),
  },
  Post: {
    FAILED_PUBLISH_POST: define({
      code: "FAILED_PUBLISH_POST",
      message: "포스트 게시에 실패했습니다.",
      status: 500,
    }),
  },
  Media: {
    NO_IMAGE_FILE: define({
      code: "NO_IMAGE_FILE",
      message: "이미지 파일이 필요합니다.",
      status: 400,
    }),
  },
} satisfies Record<string, Record<string, AppErrorOptions>>;

type ExceptionCatalog = typeof exceptions;

export const createAppError = <TPayload = unknown>(
  options: AppErrorOptions<TPayload>
) => new AppError(options);

export const fromException = <
  TNamespace extends keyof ExceptionCatalog,
  TKey extends keyof ExceptionCatalog[TNamespace] & string
>(
  namespace: TNamespace,
  key: TKey
) => {
  const definition = exceptions[namespace][key] as AppErrorOptions;
  return new AppError({ ...definition });
};
