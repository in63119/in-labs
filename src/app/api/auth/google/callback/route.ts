import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { exchangeGoogleAuthCodeToRefreshToken } from "@/server/modules/google/config";
import { saveSsm } from "@/server/modules/aws/ssm";
import { reloadServerConfig } from "@/server/bootstrap/config";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        {
          ok: false,
          message: "code 파라미터가 없습니다.",
        },
        { status: 400 }
      );
    }

    const refreshToken = await exchangeGoogleAuthCodeToRefreshToken(code);

    await saveSsm({
      patch: { GOOGLE_REFRESH_TOKEN: refreshToken },
    });

    await reloadServerConfig();

    return NextResponse.json({
      ok: true,
      refreshToken,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
