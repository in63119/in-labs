import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { putObject } from "@/server/modules/aws/s3";
import type { PostMetadataRequest, NftAttribute } from "@/common/types";
import { wallet, postStorage, relayer } from "@/lib/ethersClient";
import { fromException } from "@/server/errors/exceptions";

const toPathSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const extractKeyFromMetadataUrl = (metadataUrl: string) => {
  try {
    const parsed = new URL(metadataUrl);
    const key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    return key.length > 0 ? key : null;
  } catch {
    return null;
  }
};

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

    const { adminCode } = body;

    const rawPayload = body.payload;
    const payload =
      typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
    const {
      name,
      description,
      // image,
      // animation_url,
      external_url,
      attributes,
    } = payload;

    if (!name || !description || !external_url || attributes.length === 0) {
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
    const address = await wallet(adminCode).getAddress();

    const labValue = attributes.find(
      (item: NftAttribute) => item.trait_type === "Lab"
    )?.value;
    const labSegment =
      typeof labValue === "string" ? toPathSegment(labValue) : "lab";

    const slugValue = attributes.find(
      (item: NftAttribute) => item.trait_type === "Slug"
    )?.value;
    const slugSegment =
      typeof slugValue === "string" ? toPathSegment(slugValue) : "post";

    const existingMetadataUrl =
      typeof body.metadataUrl === "string" && body.metadataUrl.trim().length > 0
        ? body.metadataUrl.trim()
        : null;

    let metadataUrl: string;

    if (existingMetadataUrl) {
      const key = extractKeyFromMetadataUrl(existingMetadataUrl);

      if (!key || !key.startsWith(`users/${address}/`)) {
        return NextResponse.json(
          {
            ok: false,
            message: "업데이트할 포스트를 찾을 수 없습니다.",
          },
          { status: 400 }
        );
      }

      metadataUrl = await putObject(
        key,
        JSON.stringify(payload),
        "application/json"
      );
    } else {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .replace("Z", "");
      const key = `users/${address}/posts/${labSegment}/${slugSegment}/metadata-${timestamp}.json`;

      metadataUrl = await putObject(
        key,
        JSON.stringify(payload),
        "application/json"
      );

      const contract = postStorage.connect(relayer);
      const post = await contract.post(address, metadataUrl);
      const receipt = await post.wait();

      if (!receipt?.status) {
        throw fromException("Post", "FAILED_PUBLISH_POST");
      }
    }

    const basePaths = new Set([
      "/",
      "/tech-lab",
      "/food-lab",
      "/bible-lab",
      "/youtube",
    ]);
    basePaths.add(`/${labSegment}`);
    const detailPath = `/${labSegment}/${slugSegment}`;
    basePaths.add(detailPath);

    basePaths.forEach((path) => {
      revalidatePath(path);
    });

    return NextResponse.json({
      ok: true,
      metadataUrl,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
