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

    const env = process.env.NODE_ENV ?? "development";
    const accessKey = process.env.AWS_SSM_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SSM_SECRET_KEY;
    const region = process.env.AWS_REGION;
    const ssmServer = process.env.AWS_SSM_SERVER;

    if (!accessKey || !secretAccessKey || !region || !ssmServer) {
      return NextResponse.json(
        {
          ok: false,
          message: "AWS SSM 환경변수가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    await saveSsm({
      accessKey,
      secretAccessKey,
      region,
      param: `${ssmServer}/${env}`,
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
