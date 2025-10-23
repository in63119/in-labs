import "server-only";

export type AppErrorOptions<TPayload = unknown> = {
  code: string;
  message: string;
  status?: number;
  payload?: TPayload;
  cause?: unknown;
};

export default class AppError<TPayload = unknown> extends Error {
  readonly code: string;
  readonly status: number;
  readonly payload?: TPayload;

  constructor(options: AppErrorOptions<TPayload>) {
    const { code, message, status = 500, payload, cause } = options;
    super(message, { cause });
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.payload = payload;
  }
}
