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
