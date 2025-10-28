import type { PostDraftPayload } from "@/common/types";

export const publishPost = async (payload: PostDraftPayload) => {
  console.log("publishPost payload", payload);
};
