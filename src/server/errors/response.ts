import "server-only";

import { NextResponse } from "next/server";

import AppError from "./AppError";

export const createErrorResponse = (error: unknown) => {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        ok: false,
        code: error.code,
        message: error.message,
        payload: error.payload,
      },
      { status: error.status }
    );
  }

  console.error("Unhandled server error:", error);

  return NextResponse.json(
    {
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "알 수 없는 오류가 발생했습니다.",
    },
    { status: 500 }
  );
};
