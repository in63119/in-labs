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
  if (!isLabCategoryVisible("food")) {
    return {};
  }

  const { slug } = await params;
  const post = await getPostBySlug(slug, "food");
  if (!post) {
    return {};
  }

  return buildLabPostMetadata(post);
}

export default async function FoodPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  if (!isLabCategoryVisible("food")) {
    notFound();
  }

  const { slug } = await params;
  const post = await getPostBySlug(slug, "food");

  if (!post) {
    notFound();
  }

  const relatedPosts = (await getPostsByCategory("food"))
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  return <LabPostPage post={post} relatedPosts={relatedPosts} />;
}
