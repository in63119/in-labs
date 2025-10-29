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
  payload: NftMetadata;
  adminCode: string;
};

export type PublishPostResponse = {
  ok: true;
  metadataUrl: string;
};
