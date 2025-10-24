import "server-only";

import AppError, { AppErrorOptions } from "./AppError";

const define = <TPayload = unknown>(options: AppErrorOptions<TPayload>) =>
  options;

export const exceptions = {
  User: {
    USER_NOT_FOUND: define({
      code: "USER_NOT_FOUND",
      message: "사용자를 찾을 수 없습니다.",
      status: 404,
    }),
  },
  Auth: {
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
    FAILED_VERIFY_CREDENTIAL: define({
      code: "FAILED_VERIFY_CREDENTIAL",
      message: "자격 증명 검증에 실패했습니다.",
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
