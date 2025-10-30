export type StructuredDataType =
  | "None"
  | "Article"
  | "BlogPosting"
  | "HowTo"
  | "FAQPage";

export type PostDraftPayload = {
  labName: string;
  title: string;
  slug: string;
  metaDescription: string;
  summary: string;
  tags: string[];
  ogImageUrl: string;
  structuredData: StructuredDataType;
  relatedLinks: string[];
  content: string;
  publishUrl: string;
};

export type PostPublishRequest = {
  payload: PostDraftPayload;
  adminCode: string;
};

export type PostCategory = "tech" | "food" | "bible";

export type PostSummary = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: PostCategory;
  labName: string;
  labSegment: string;
  href: string;
  publishedAt: string;
  readingTimeMinutes: number;
  readingTimeLabel: string;
  tags: string[];
  metadataUrl: string;
  image?: string;
  externalUrl: string;
  content: string;
  relatedLinks: string[];
  structuredData?: StructuredDataType;
};

export type NftAttribute = {
  trait_type: string;
  value: string | number;
  display_type?: string;
};

export type NftMetadata = {
  name: string;
  description: string;
  image?: string;
  animation_url?: string;
  external_url: string;
  attributes: NftAttribute[];
};

export type PostMetadataRequest = {
  payload: NftMetadata | string;
  adminCode: string;
};

export type PublishPostResponse = {
  ok: true;
  metadataUrl: string;
};
