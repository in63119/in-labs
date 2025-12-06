import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import type {
  PostMetadataRequest,
  NftAttribute,
  NftMetadata,
} from "@/common/types";
import { publishPost } from "@/server/modules/post/post.service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request
      .json()
      .catch(() => null)) as PostMetadataRequest | null;

    if (!body) {
      return NextResponse.json(
        {
          ok: false,
          message: "잘못된 요청입니다.",
        },
        { status: 400 }
      );
    }

    const { adminCode, metadataUrl } = body;

    const rawPayload = body.payload;
    let parsedPayload: PostMetadataRequest["payload"] | null = null;

    try {
      parsedPayload =
        typeof rawPayload === "string"
          ? (JSON.parse(rawPayload) as PostMetadataRequest["payload"])
          : rawPayload;
    } catch {
      parsedPayload = null;
    }

    if (
      !parsedPayload ||
      typeof parsedPayload !== "object" ||
      !("attributes" in parsedPayload)
    ) {
      return NextResponse.json(
        {
          ok: false,
          message: "잘못된 요청입니다.",
        },
        { status: 400 }
      );
    }

    const { name, description, external_url, attributes } = parsedPayload as {
      name?: string;
      description?: string;
      external_url?: string;
      attributes?: NftAttribute[];
    };

    if (!name || !description || !external_url || !attributes?.length) {
      return NextResponse.json(
        {
          ok: false,
          message: "잘못된 요청입니다.",
        },
        { status: 400 }
      );
    }

    if (!adminCode) {
      return NextResponse.json(
        {
          ok: false,
          message: "Admin 코드가 없습니다.",
        },
        { status: 400 }
      );
    }

    const normalizedPayload = parsedPayload as NftMetadata;

    const { metadataUrl: savedMetadataUrl } = await publishPost({
      adminCode,
      metadataUrl,
      payload: normalizedPayload,
    });

    return NextResponse.json({
      ok: true,
      metadataUrl: savedMetadataUrl,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
