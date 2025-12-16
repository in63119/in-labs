export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const DEFAULT_ERROR_MESSAGE = "요청에 실패했습니다.";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: HeadersInit;
};

export async function apiFetch<TResponse>(
  input: string,
  options: ApiFetchOptions = {}
): Promise<TResponse> {
  const { body, headers, method = "GET", ...rest } = options;
  const isGet = method.toUpperCase() === "GET";
  const url = input.startsWith("http") ? input : `${API_BASE_URL}${input}`;

  const mergedHeaders: HeadersInit = {
    ...(headers ?? {}),
  };

  if (!isGet) {
    mergedHeaders["Content-Type"] =
      mergedHeaders["Content-Type"] ?? "application/json";
  }

  const requestInit: RequestInit = {
    method,
    credentials: !isGet ? "include" : undefined,
    headers: mergedHeaders,
    ...rest,
  };

  if (body !== undefined) {
    requestInit.body =
      typeof body === "string" ? body : JSON.stringify(body ?? null);
  }

  const response = await fetch(url, requestInit);

  const contentType = response.headers.get("content-type") ?? "";

  const parseJson =
    contentType.includes("application/json") ||
    contentType.includes("application/problem+json");

  let responseBody: unknown = null;

  if (response.status !== 204) {
    responseBody = parseJson
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);
  }

  if (!response.ok) {
    const message =
      typeof responseBody === "object" &&
      responseBody !== null &&
      "message" in responseBody
        ? String(
            (responseBody as { message?: unknown }).message ??
              DEFAULT_ERROR_MESSAGE
          )
        : typeof responseBody === "string" && responseBody
        ? responseBody
        : DEFAULT_ERROR_MESSAGE;

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as TResponse;
}
