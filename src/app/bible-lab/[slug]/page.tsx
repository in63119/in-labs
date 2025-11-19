import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LabPostPage from "@/components/LabPostPage";
import { buildLabPostMetadata } from "@/components/LabPostMetadata";
import {
  getPostBySlug,
  getPostsByCategory,
} from "@/server/modules/post/post.service";
import { isLabCategoryVisible } from "@/common/utils/labVisibility";

type RouteParams = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  if (!isLabCategoryVisible("bible")) {
    return {};
  }

  const { slug } = await params;
  const post = await getPostBySlug(slug, "bible");
  if (!post) {
    return {};
  }

  return buildLabPostMetadata(post);
}

export default async function BiblePostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  if (!isLabCategoryVisible("bible")) {
    notFound();
  }

  const { slug } = await params;
  const post = await getPostBySlug(slug, "bible");

  if (!post) {
    notFound();
  }

  const relatedPosts = (await getPostsByCategory("bible"))
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  return <LabPostPage post={post} relatedPosts={relatedPosts} />;
}
