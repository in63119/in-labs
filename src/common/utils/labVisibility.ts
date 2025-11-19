import type { PostCategory } from "@/common/types";

const ADSENSE_APPROVED =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

const BLOCKED_CATEGORIES: PostCategory[] = ["food", "bible"];
const BLOCKED_HREFS = new Set(["/food-lab", "/bible-lab"]);

export const isLabCategoryVisible = (category: PostCategory) => {
  return ADSENSE_APPROVED || !BLOCKED_CATEGORIES.includes(category);
};

export const isLabHrefVisible = (href: string) => {
  if (ADSENSE_APPROVED) {
    return true;
  }

  return !BLOCKED_HREFS.has(href);
};

export const isAdSenseApproved = () => ADSENSE_APPROVED;
