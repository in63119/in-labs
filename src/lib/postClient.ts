import type { PostPublishRequest } from "@/common/types";
import { apiFetch } from "./apiClient";

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
  // Todo: server로 json 데이터 돌려서 s3처리
  const response = await apiFetch<PublishPostResponse>("/api/posts/publish", {
    method: "POST",
    body: payload,
  });

  return response;
};

// export const publishPost = async ({
//   payload,
//   adminCode,
// }: PostPublishRequest) => {
//   console.log("나오느냐.  ");
//   try {
//     /**
//         (여기까지 왔으면 인증이 완료됨)
//         1. S3에 포스트 콘텐츠 업로드
//         2. 블록체인에 NFT 민팅
//     */

//     const address = await wallet(adminCode).getAddress();

//     const nftMetaData = {
//       name: payload.title,
//       description: payload.metaDescription,
//       image: payload.ogImageUrl,
//       animation_url: "", // 향후 동영상 등 미디어 파일 URL이 들어갈 수 있음
//       external_url: payload.publishUrl,
//       attributes: [
//         { trait_type: "Lab", value: payload.labName },
//         { trait_type: "StructuredData", value: payload.structuredData },
//         { trait_type: "Slug", value: payload.slug },
//         { trait_type: "Summary", value: payload.summary },
//         { trait_type: "Tags", value: `${payload.tags.join(" ")}` },
//         { trait_type: "Content", value: payload.content },
//         {
//           trait_type: "RelatedLinks",
//           value: payload.relatedLinks.join(" ") || "",
//         },
//       ],
//     };
//     const json = JSON.stringify(nftMetaData);
//     // const tokenUri = await putObject(
//     //   `users/${address}/${registrationInfo.aaguid}.json`,
//     //   JSON.stringify(registrationInfo, toBase64Replacer, 2),
//     //   "application/json"
//     // );
//   } catch (error) {
//     console.log("publishPost error", error);
//     throw error;
//   }
// };
