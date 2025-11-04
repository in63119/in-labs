import type {
  DeletePostResponse,
  PostDeleteRequest,
  PostPublishRequest,
  PublishPostResponse,
} from "@/common/types";
import { apiFetch } from "./apiClient";
import { endpoints } from "@/app/api";

export const publishPost = async ({
  payload,
  adminCode,
  metadataUrl,
}: PostPublishRequest) => {
  try {
    const publishedAt = new Date().toISOString();
    const wordCount = payload.content
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

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
        { trait_type: "PublishedAt", value: publishedAt },
        {
          trait_type: "WordCount",
          value: wordCount,
          display_type: "number",
        },
        {
          trait_type: "ReadingTimeMinutes",
          value: readingTimeMinutes,
          display_type: "number",
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
          metadataUrl,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async ({
  adminCode,
  labSegment,
  metadataUrl,
  postId,
  slug,
}: PostDeleteRequest) => {
  try {
    const response = await apiFetch<DeletePostResponse>(
      endpoints.posts.delete,
      {
        method: "DELETE",
        body: {
          adminCode,
          postId,
          metadataUrl,
          labSegment,
          slug,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};
