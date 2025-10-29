import type { PostPublishRequest } from "@/common/types";
import { apiFetch } from "./apiClient";
import { wallet } from "./ethersClient";
import { endpoints } from "@/app/api";
import { metadata } from "@/app/layout";

export type PublishPostResponse = {
  ok: true;
  metadataUrl: string;
  wordCount: number;
  readingTimeMinutes: number;
  adminAddress: string;
};

export const publishPost = async ({
  payload,
  adminCode,
}: PostPublishRequest) => {
  try {
    const nftMetaData = {
      name: payload.title,
      description: payload.metaDescription,
      image: payload.ogImageUrl,
      animation_url: "", // 향후 동영상 등 미디어 파일 URL이 들어갈 수 있음
      external_url: payload.publishUrl,
      attributes: [
        { trait_type: "Lab", value: payload.labName },
        { trait_type: "StructuredData", value: payload.structuredData },
        { trait_type: "Slug", value: payload.slug },
        { trait_type: "Summary", value: payload.summary },
        { trait_type: "Tags", value: `${payload.tags.join(" ")}` },
        { trait_type: "Content", value: payload.content },
        {
          trait_type: "RelatedLinks",
          value: payload.relatedLinks.join(" ") || "",
        },
      ],
    };
    const jsonMetaData = JSON.stringify(nftMetaData);

    const response = await apiFetch<PublishPostResponse>(
      endpoints.posts.publish,
      {
        method: "POST",
        body: {
          payload: jsonMetaData,
          adminCode,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};
