import { getAdminCode } from "../auth/auth.service";
import {
  wallet,
  postStorage,
  relayer,
  getTypedData,
  signTypedData,
  getFeeData,
  inForwarder,
  excute,
} from "@/lib/ethersClient";
import type {
  NftAttribute,
  NftMetadata,
  PostCategory,
  PostDeleteRequest,
  PostSummary,
  StructuredDataType,
} from "@/common/types";
import { createAppError, fromException } from "@/server/errors/exceptions";
import { deleteObject, putObject } from "../aws/s3";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { CONTRACT_NAME } from "@/common/enums";

const LAB_MAP: Record<
  string,
  { category: PostCategory; labSegment: string; hrefPrefix: string }
> = {
  "Tech Lab": {
    category: "tech",
    labSegment: "tech-lab",
    hrefPrefix: "/tech-lab",
  },
  "Dev Lab": {
    category: "dev",
    labSegment: "dev-lab",
    hrefPrefix: "/dev-lab",
  },
  Guides: {
    category: "guides",
    labSegment: "guides",
    hrefPrefix: "/guides",
  },
};

const DEFAULT_LAB = LAB_MAP["Tech Lab"];

export const revalidatePostPaths = (labSegment: string, slug: string) => {
  const basePaths = new Set([
    "/",
    "/tech-lab",
    "/dev-lab",
    "/guides",
    "/youtube",
  ]);
  basePaths.add(`/${labSegment}`);
  basePaths.add(`/${labSegment}/${slug}`);

  basePaths.forEach((path) => {
    revalidatePath(path);
  });
  revalidateTag("posts");
  revalidateTag(`posts:${envSegment}`);
};

export const extractKeyFromMetadataUrl = (metadataUrl: string) => {
  try {
    const parsed = new URL(metadataUrl);
    const key = decodeURIComponent(parsed.pathname.replace(/^\/+/u, ""));
    return key.length > 0 ? key : null;
  } catch {
    return null;
  }
};

const toPathSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const findAttributeValue = (
  attributes: NftAttribute[],
  traitType: string
): string | number | undefined =>
  attributes.find((attr) => attr.trait_type === traitType)?.value;

const isStructuredDataType = (value: string): value is StructuredDataType => {
  return ["None", "Article", "BlogPosting", "HowTo", "FAQPage"].includes(
    value as StructuredDataType
  );
};

const extractTimestampFromUrl = (url: string): string => {
  const match = url.match(
    /metadata-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3})\.json$/
  );
  if (!match) {
    return new Date().toISOString();
  }
  const raw = match[1];
  const [datePart, timePart] = raw.split("T");
  const [hour = "00", minute = "00", second = "00", millisecond = "000"] =
    timePart?.split("-") ?? [];
  const isoCandidate = `${datePart}T${hour}:${minute}:${second}.${millisecond}Z`;
  const parsed = new Date(isoCandidate);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
};

const mapMetadataToSummary = (
  metadata: NftMetadata,
  metadataUrl: string
): Omit<PostSummary, "tokenId"> => {
  const attributes = metadata.attributes ?? [];

  const labValue = findAttributeValue(attributes, "Lab");
  const labLabel =
    typeof labValue === "string" && labValue.trim().length > 0
      ? labValue
      : "Tech Lab";
  const labInfo = LAB_MAP[labLabel] ?? DEFAULT_LAB;

  const slugValue = findAttributeValue(attributes, "Slug");
  const slug =
    typeof slugValue === "string" && slugValue.trim().length > 0
      ? toPathSegment(slugValue)
      : toPathSegment(metadata.name);

  const summaryValue = findAttributeValue(attributes, "Summary");
  const summary =
    (typeof summaryValue === "string" && summaryValue.trim().length > 0
      ? summaryValue
      : metadata.description) ?? "";

  const contentValue = findAttributeValue(attributes, "Content");
  const content =
    typeof contentValue === "string" ? contentValue : metadata.description;

  const tagsValue = findAttributeValue(attributes, "Tags");
  const tags =
    typeof tagsValue === "string"
      ? tagsValue
          .split(" ")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  const relatedLinksValue = findAttributeValue(attributes, "RelatedLinks");
  const relatedLinks =
    typeof relatedLinksValue === "string"
      ? relatedLinksValue
          .split(" ")
          .map((link) => link.trim())
          .filter(Boolean)
      : [];

  const publishedAtValue = findAttributeValue(attributes, "PublishedAt");
  const publishedAt =
    typeof publishedAtValue === "string" && publishedAtValue.length > 0
      ? new Date(publishedAtValue).toISOString()
      : extractTimestampFromUrl(metadataUrl);

  const wordCountValue = findAttributeValue(attributes, "WordCount");
  const wordCount =
    typeof wordCountValue === "number"
      ? wordCountValue
      : content.trim().split(/\s+/).filter(Boolean).length;

  const readingTimeValue = findAttributeValue(attributes, "ReadingTimeMinutes");
  const readingTimeMinutes =
    typeof readingTimeValue === "number"
      ? readingTimeValue
      : Math.max(1, Math.round(wordCount / 200));

  const href = `${labInfo.hrefPrefix}/${slug}`;

  const structuredDataValue = findAttributeValue(attributes, "StructuredData");
  const structuredData =
    typeof structuredDataValue === "string"
      ? isStructuredDataType(structuredDataValue)
        ? structuredDataValue
        : undefined
      : undefined;

  return {
    slug,
    title: metadata.name,
    summary,
    description: metadata.description,
    category: labInfo.category,
    labName: labLabel,
    labSegment: labInfo.labSegment,
    href,
    publishedAt,
    readingTimeMinutes,
    readingTimeLabel: `${readingTimeMinutes} min read`,
    tags,
    metadataUrl,
    image: metadata.image,
    externalUrl: metadata.external_url,
    content,
    relatedLinks,
    structuredData,
  };
};

export const getPostsByCategory = async (
  category: PostCategory
): Promise<PostSummary[]> => {
  const posts = await getPosts();
  return posts.filter((post) => post.category === category);
};

export const getPostBySlug = async (
  slug: string,
  category?: PostCategory
): Promise<PostSummary | undefined> => {
  const posts = await getPosts();
  return posts.find((post) => {
    if (category) {
      return post.slug === slug && post.category === category;
    }
    return post.slug === slug;
  });
};

export const publishPost = async ({
  adminCode,
  payload,
  metadataUrl,
}: {
  adminCode: string;
  payload: NftMetadata;
  metadataUrl?: string | null;
}) => {
  if (!adminCode || typeof adminCode !== "string") {
    throw fromException("Auth", "INVALID_AUTH_CODE");
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !Array.isArray(payload.attributes)
  ) {
    throw fromException("Post", "INVALID_REQUEST");
  }

  const userWallet = wallet(adminCode);
  const address = await userWallet.getAddress();

  const labValue = payload.attributes.find(
    (item: NftAttribute) => item.trait_type === "Lab"
  )?.value;
  const labSegment =
    typeof labValue === "string" && labValue.trim().length > 0
      ? toPathSegment(labValue)
      : "lab";

  const slugValue = payload.attributes.find(
    (item: NftAttribute) => item.trait_type === "Slug"
  )?.value;
  const slugSegment =
    typeof slugValue === "string" && slugValue.trim().length > 0
      ? toPathSegment(slugValue)
      : "post";

  const filteredAttributes = payload.attributes.filter((item: NftAttribute) => {
    if (item.trait_type !== "RelatedLinks") {
      return true;
    }
    if (typeof item.value !== "string") {
      return false;
    }
    const cleaned = item.value
      .split(/\s+/)
      .map((segment) => segment.trim())
      .filter(Boolean);
    item.value = cleaned.join(" ");
    return true;
  });

  const normalizedPayload: NftMetadata = {
    ...payload,
    attributes: filteredAttributes,
  };

  const existingMetadataUrl =
    typeof metadataUrl === "string" && metadataUrl.trim().length > 0
      ? metadataUrl.trim()
      : null;
  const existingMetadataKey = existingMetadataUrl
    ? extractKeyFromMetadataUrl(existingMetadataUrl)
    : null;

  const posts = await getPosts();
  const duplicate = posts.find((post) => {
    if (post.labSegment !== labSegment) {
      return false;
    }
    if (post.slug !== slugSegment) {
      return false;
    }
    if (existingMetadataUrl) {
      if (existingMetadataKey) {
        const postMetadataKey = extractKeyFromMetadataUrl(post.metadataUrl);
        if (postMetadataKey && postMetadataKey === existingMetadataKey) {
          return false;
        }
      } else if (post.metadataUrl === existingMetadataUrl) {
        return false;
      }
    }
    return true;
  });

  if (duplicate) {
    throw createAppError({
      code: "DUPLICATE_POST",
      message: "동일한 슬러그를 가진 포스트가 이미 존재합니다.",
      status: 409,
    });
  }

  const envSegmentForKey =
    process.env.ENV?.trim() ||
    process.env.ENV ||
    process.env.APP_ENV?.trim() ||
    process.env.NODE_ENV ||
    "development";

  let resolvedMetadataUrl: string;

  if (existingMetadataUrl) {
    if (
      !existingMetadataKey ||
      !existingMetadataKey.startsWith(`users/${address}/`)
    ) {
      throw createAppError({
        code: "INVALID_REQUEST",
        message: "업데이트할 포스트를 찾을 수 없습니다.",
        status: 400,
      });
    }

    resolvedMetadataUrl = await putObject(
      existingMetadataKey,
      JSON.stringify(normalizedPayload),
      "application/json"
    );
  } else {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .replace("Z", "");
    const key = `users/${address}/posts/${envSegmentForKey}/${labSegment}/metadata-${timestamp}.json`;

    resolvedMetadataUrl = await putObject(
      key,
      JSON.stringify(normalizedPayload),
      "application/json"
    );

    const post = await excute(CONTRACT_NAME.POSTSTORAGE, userWallet, "post", [
      address,
      resolvedMetadataUrl,
    ]);

    if (!post?.status) {
      throw fromException("Post", "FAILED_PUBLISH_POST");
    }
  }

  revalidatePostPaths(labSegment, slugSegment);

  return {
    metadataUrl: resolvedMetadataUrl,
  };
};

export const deletePost = async ({
  adminCode,
  postId,
  metadataUrl,
  labSegment,
  slug,
}: PostDeleteRequest) => {
  if (!adminCode || typeof adminCode !== "string") {
    throw fromException("Auth", "INVALID_AUTH_CODE");
  }

  if (!postId || typeof postId !== "string") {
    throw fromException("Post", "INVALID_POST_ID");
  }

  if (!metadataUrl || typeof metadataUrl !== "string") {
    throw fromException("Post", "INVALID_METADATA_URL");
  }

  if (!labSegment || typeof labSegment !== "string") {
    throw fromException("Post", "INVALID_REQUEST");
  }

  if (!slug || typeof slug !== "string") {
    throw fromException("Post", "INVALID_REQUEST");
  }

  const address = await wallet(adminCode).getAddress();
  const key = extractKeyFromMetadataUrl(metadataUrl);

  if (!key || !key.startsWith(`users/${address}/`)) {
    throw fromException("Auth", "INVALID_AUTH_CODE");
  }

  const userWallet = wallet(adminCode);

  const typedData = await getTypedData(
    CONTRACT_NAME.POSTSTORAGE,
    await userWallet.getAddress(),
    "burn",
    [Number(postId)]
  );
  const signature = await signTypedData(userWallet, typedData);
  const request = {
    ...typedData.message,
    signature,
  };

  const contract = inForwarder.connect(relayer);
  const feeData = await getFeeData();

  const tx = await contract.execute(request, {
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
  });
  const receipt = await tx.wait();
  if (!receipt?.status) {
    throw fromException("Blockchain", "FAILED_TX");
  }

  try {
    await deleteObject(key);
  } catch (error) {
    console.error("Failed to delete metadata from S3", error);
  }

  revalidatePostPaths(labSegment, slug);
};

// 여기서 부터 지울 것

const envSegment =
  process.env.APP_ENV?.trim() ||
  process.env.ENV?.trim() ||
  process.env.ENV ||
  process.env.NODE_ENV ||
  "development";

const fetchPosts = async (): Promise<PostSummary[]> => {
  const adminCode = getAdminCode();
  const address = await wallet(adminCode).getAddress();

  const contract = postStorage.connect(relayer);
  const rawPosts = await contract.getPosts(address);

  const posts = await Promise.all(
    rawPosts.map(async ([tokenId, metadataUrl]: [bigint, string]) => {
      const res = await fetch(metadataUrl);
      const metadata = (await res.json()) as NftMetadata;
      const summary = mapMetadataToSummary(metadata, metadataUrl);
      return {
        ...summary,
        tokenId: tokenId.toString(),
      };
    })
  );

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

export const getPosts = unstable_cache(fetchPosts, ["posts", envSegment], {
  tags: ["posts", `posts:${envSegment}`],
});
