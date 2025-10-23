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
    NO_PASSKEY: define({
      code: "NO_PASSKEY",
      message: "등록된 패스키가 없습니다.",
      status: 400,
    }),
    MISSING_EMAIL_PARAM: define({
      code: "MISSING_EMAIL",
      message: "email 파라미터가 필요합니다.",
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
