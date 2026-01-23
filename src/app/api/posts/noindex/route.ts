import { NextRequest, NextResponse } from "next/server";

import { createErrorResponse } from "@/server/errors/response";
import { getPosts } from "@/server/modules/post/post.service";
import { getAdminCode } from "@/server/modules/auth/auth.service";
import { isNoIndexPost } from "@/common/utils/postNoIndex";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as {
      adminCode?: string;
    } | null;

    if (!body?.adminCode) {
      return NextResponse.json(
        { ok: false, message: "Admin 코드가 없습니다." },
        { status: 400 }
      );
    }

    const adminCode = getAdminCode();
    if (!adminCode || body.adminCode !== adminCode) {
      return NextResponse.json(
        { ok: false, message: "관리자 인증이 필요합니다." },
        { status: 401 }
      );
    }

    const posts = await getPosts();
    const noindexPosts = posts.filter((post) =>
      isNoIndexPost(post.labSegment, post.slug)
    );

    return NextResponse.json({ ok: true, posts: noindexPosts });
  } catch (error) {
    return createErrorResponse(error);
  }
}
