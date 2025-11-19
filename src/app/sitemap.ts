import type { MetadataRoute } from "next";
import { getPosts } from "@/server/modules/post/post.service";
import {
  isLabCategoryVisible,
  isLabHrefVisible,
} from "@/common/utils/labVisibility";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://in-labs.xyz";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  "/tech-lab",
  "/food-lab",
  "/bible-lab",
  "/youtube",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const now = new Date().toISOString();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.filter((path) => {
    if (path === "/food-lab" || path === "/bible-lab") {
      return isLabHrefVisible(path);
    }
    return true;
  }).map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post) => isLabCategoryVisible(post.category))
    .map((post) => ({
      url: `${BASE_URL}${post.href}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticEntries, ...postEntries];
}
