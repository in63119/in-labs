import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LabPostPage from "@/components/LabPostPage";
import { buildLabPostMetadata } from "@/components/LabPostMetadata";
import { getPosts } from "@/lib/postClient";

type RouteParams = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPosts()).find(
    (item) => item.category === "dev" && item.slug === slug
  );
  if (!post) {
    return {};
  }

  return buildLabPostMetadata(post);
}

export default async function DevPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.category === "dev" && item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((item) => item.category === "dev" && item.slug !== post.slug)
    .slice(0, 2);

  return <LabPostPage post={post} relatedPosts={relatedPosts} />;
}
