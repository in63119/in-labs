import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { putObject } from "@/server/modules/aws/s3";
import type { PostMetadataRequest, NftAttribute } from "@/common/types";
import { wallet, postStorage, relayer } from "@/lib/ethersClient";
import { fromException } from "@/server/errors/exceptions";
import {
  extractKeyFromMetadataUrl,
  getPosts,
} from "@/server/modules/post/post.service";

const toPathSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

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
    const existingMetadataKey = existingMetadataUrl
      ? extractKeyFromMetadataUrl(existingMetadataUrl)
      : null;

    const posts = await getPosts();
    const duplicate = posts.find((post) => {
      if (post.labSegment !== labSegment) {
        return false;
      }
      if (post.slug !== slugSegment) {
        return false;
      }
      if (existingMetadataUrl) {
        if (existingMetadataKey) {
          const postMetadataKey = extractKeyFromMetadataUrl(post.metadataUrl);
          if (postMetadataKey && postMetadataKey === existingMetadataKey) {
            return false;
          }
        } else if (post.metadataUrl === existingMetadataUrl) {
          return false;
        }
      }
      return true;
    });

    if (duplicate) {
      return NextResponse.json(
        {
          ok: false,
          message: "동일한 슬러그를 가진 포스트가 이미 존재합니다.",
        },
        { status: 409 }
      );
    }

    const filteredAttributes = attributes.filter((item: NftAttribute) => {
      if (item.trait_type !== "RelatedLinks") {
        return true;
      }
      if (typeof item.value !== "string") {
        return false;
      }
      const cleaned = item.value
        .split(/\s+/)
        .map((segment) => segment.trim())
        .filter(Boolean);
      item.value = cleaned.join(" ");
      return true;
    });

    payload.attributes = filteredAttributes;

    const envSegment =
      process.env.ENV?.trim() || process.env.ENV || "development";

    let metadataUrl: string;

    if (existingMetadataUrl) {
      if (
        !existingMetadataKey ||
        !existingMetadataKey.startsWith(`users/${address}/`)
      ) {
        return NextResponse.json(
          {
            ok: false,
            message: "업데이트할 포스트를 찾을 수 없습니다.",
          },
          { status: 400 }
        );
      }

      metadataUrl = await putObject(
        existingMetadataKey,
        JSON.stringify(payload),
        "application/json"
      );
    } else {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .replace("Z", "");
      const key = `users/${address}/posts/${envSegment}/${labSegment}/metadata-${timestamp}.json`;

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
      "/dev-lab",
      "/guides",
      "/youtube",
    ]);
    basePaths.add(`/${labSegment}`);
    const detailPath = `/${labSegment}/${slugSegment}`;
    basePaths.add(detailPath);

    basePaths.forEach((path) => {
      revalidatePath(path);
    });
    revalidateTag("posts");
    revalidateTag(`posts:${envSegment}`);

    return NextResponse.json({
      ok: true,
      metadataUrl,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
