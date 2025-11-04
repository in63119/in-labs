import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LabPostPage from "@/components/LabPostPage";
import { buildLabPostMetadata } from "@/components/LabPostMetadata";
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
