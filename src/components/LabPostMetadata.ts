import type { Metadata } from "next";
import type { PostSummary } from "@/common/types";

export const buildLabPostMetadata = (post: PostSummary): Metadata => ({
  title: `${post.title} | ${post.labName}`,
  description: post.summary,
  alternates: {
    canonical: post.href,
  },
  openGraph: {
    title: post.title,
    description: post.summary,
    type: "article",
    url: post.href,
    images: post.image ? [{ url: post.image }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.summary,
    images: post.image ? [post.image] : undefined,
  },
});
