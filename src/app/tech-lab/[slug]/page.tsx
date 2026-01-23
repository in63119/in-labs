import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LabPostPage from "@/components/LabPostPage";
import { buildLabPostMetadata } from "@/components/LabPostMetadata";
import { isNoIndexPost } from "@/common/utils/postNoIndex";
import {
  getPostBySlug,
  getPostsByCategory,
} from "@/server/modules/post/post.service";

type RouteParams = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, "tech");
  if (!post) {
    return {};
  }

  const metadata = buildLabPostMetadata(post);
  const shouldNoIndex = isNoIndexPost("tech-lab", slug);

  if (!shouldNoIndex) {
    return metadata;
  }

  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function TechPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, "tech");

  if (!post) {
    notFound();
  }

  const relatedPosts = (await getPostsByCategory("tech"))
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  return <LabPostPage post={post} relatedPosts={relatedPosts} />;
}
