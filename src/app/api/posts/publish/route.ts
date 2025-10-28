import { NextRequest, NextResponse } from "next/server";

import { createErrorResponse } from "@/server/errors/response";
import { putObject } from "@/server/modules/aws/s3";
import { sha256 } from "@/lib/crypto";
import { wallet } from "@/lib/ethersClient";

type PublishRequestBody = {
  payload?: {
    labName: string;
    title: string;
    slug: string;
    metaDescription: string;
    summary: string;
    tags: string[];
    ogImageUrl: string;
    structuredData: string;
    relatedLinks: string[];
    content: string;
    publishUrl: string;
  };
  adminCode?: string;
};

const toPathSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const calculateWordCount = (content: string) =>
  content.trim().split(/\s+/).filter(Boolean).length;

const estimateReadingTime = (wordCount: number) =>
  Math.max(1, Math.round(wordCount / 200));

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as PublishRequestBody | null;

    if (!body?.payload || !body.adminCode) {
      return NextResponse.json(
        {
          ok: false,
          message: "payload와 adminCode가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const {
      payload: {
        labName,
        title,
        slug,
        metaDescription,
        summary,
        tags,
        ogImageUrl,
        structuredData,
        relatedLinks,
        content,
        publishUrl,
      },
      adminCode,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          ok: false,
          message: "title, slug, content 값은 필수입니다.",
        },
        { status: 400 }
      );
    }

    const adminHash = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;
    if (!adminHash) {
      throw new Error("NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH env is missing");
    }

    if (sha256(adminCode) !== adminHash) {
      return NextResponse.json(
        {
          ok: false,
          message: "관리자 인증 코드가 일치하지 않습니다.",
        },
        { status: 401 }
      );
    }

    // Derive admin wallet address (can be used for future on-chain actions)
    const adminWallet = wallet(adminCode);
    const adminAddress = await adminWallet.getAddress();

    const wordCount = calculateWordCount(content);
    const readingTimeMinutes = estimateReadingTime(wordCount);

    const metadata = {
      name: title,
      description: metaDescription || summary || title,
      image: ogImageUrl || undefined,
      external_url: publishUrl,
      attributes: [
        { trait_type: "Lab", value: labName },
        { trait_type: "StructuredData", value: structuredData },
        { trait_type: "Slug", value: slug },
        { trait_type: "Summary", value: summary },
        { trait_type: "Tags", value: tags.join(" ") },
        { trait_type: "Related Links", value: relatedLinks.join(" "), display_type: "multi_link" },
        { trait_type: "Word Count", value: wordCount, display_type: "number" },
        {
          trait_type: "Reading Time (min)",
          value: readingTimeMinutes,
          display_type: "number",
        },
      ],
    };

    const metadataJson = JSON.stringify(metadata, null, 2);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const labSegment = toPathSegment(labName) || "lab";
    const slugSegment = toPathSegment(slug) || "post";
    const key = `posts/${labSegment}/${slugSegment}/metadata-${timestamp}.json`;

    const metadataUrl = await putObject(key, metadataJson, "application/json");

    return NextResponse.json({
      ok: true,
      metadataUrl,
      wordCount,
      readingTimeMinutes,
      adminAddress,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
