import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { wallet, postStorage, relayer } from "@/lib/ethersClient";
import { deleteObject } from "@/server/modules/aws/s3";
import { extractKeyFromMetadataUrl } from "@/server/modules/post/storageUtils";
import type { PostDeleteRequest } from "@/common/types";

const revalidatePostPaths = (labSegment: string, slug: string) => {
  const basePaths = new Set([
    "/",
    "/tech-lab",
    "/food-lab",
    "/bible-lab",
    "/youtube",
  ]);
  basePaths.add(`/${labSegment}`);
  basePaths.add(`/${labSegment}/${slug}`);

  basePaths.forEach((path) => {
    revalidatePath(path);
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | PostDeleteRequest
      | null;

    if (!body) {
      return NextResponse.json(
        {
          ok: false,
          message: "잘못된 요청입니다.",
        },
        { status: 400 }
      );
    }

    const { adminCode, postId, metadataUrl, labSegment, slug } = body;

    if (!adminCode || typeof adminCode !== "string") {
      return NextResponse.json(
        {
          ok: false,
          message: "Admin 코드가 없습니다.",
        },
        { status: 400 }
      );
    }

    if (!postId || typeof postId !== "string") {
      return NextResponse.json(
        {
          ok: false,
          message: "postId 값이 필요합니다.",
        },
        { status: 400 }
      );
    }

    if (!metadataUrl || typeof metadataUrl !== "string") {
      return NextResponse.json(
        {
          ok: false,
          message: "metadataUrl 값이 필요합니다.",
        },
        { status: 400 }
      );
    }

    if (!labSegment || typeof labSegment !== "string") {
      return NextResponse.json(
        {
          ok: false,
          message: "labSegment 값이 필요합니다.",
        },
        { status: 400 }
      );
    }

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          ok: false,
          message: "slug 값이 필요합니다.",
        },
        { status: 400 }
      );
    }

    const address = await wallet(adminCode).getAddress();
    const key = extractKeyFromMetadataUrl(metadataUrl);

    if (!key || !key.startsWith(`users/${address}/`)) {
      return NextResponse.json(
        {
          ok: false,
          message: "권한이 없습니다.",
        },
        { status: 403 }
      );
    }

    const contract = postStorage.connect(relayer);
    const burnTx = await contract.burn(BigInt(postId));
    const receipt = await burnTx.wait();

    if (!receipt?.status) {
      return NextResponse.json(
        {
          ok: false,
          message: "포스트 삭제에 실패했습니다.",
        },
        { status: 500 }
      );
    }

    try {
      await deleteObject(key);
    } catch (error) {
      console.error("Failed to delete metadata from S3", error);
    }

    revalidatePostPaths(labSegment, slug);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
