export const isNoIndexPost = (labSegment: string, slug: string) => {
  if (labSegment !== "tech-lab") {
    return false;
  }

  return (
    slug.startsWith("blockchain-course-") ||
    slug.startsWith("solidity-course-")
  );
};
