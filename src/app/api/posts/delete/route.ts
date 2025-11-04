import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import type { PostDeleteRequest } from "@/common/types";
import { deletePost } from "@/server/modules/post/post.service";

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request
      .json()
      .catch(() => null)) as PostDeleteRequest | null;

    if (!body) {
      return NextResponse.json(
        {
          ok: false,
          message: "잘못된 요청입니다.",
        },
        { status: 400 }
      );
    }

    await deletePost(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
