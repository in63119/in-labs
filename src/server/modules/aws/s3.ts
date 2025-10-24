import "server-only";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
  DeleteObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from "@aws-sdk/client-s3";

const REGION = process.env.AWS_S3_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;

const credentials =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined;

export const s3Client = new S3Client({
  region: REGION,
  credentials,
});

const buildObjectUrl = (key: string) => {
  if (!BUCKET) {
    throw new Error("AWS_S3_BUCKET env is missing");
  }

  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  if (!REGION || REGION === "us-east-1") {
    return `https://${BUCKET}.s3.amazonaws.com/${encodedKey}`;
  }

  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodedKey}`;
};

export const putObject = async (
  key: string,
  body: PutObjectCommandInput["Body"],
  contentType?: string
) => {
  if (!BUCKET) {
    throw new Error("AWS_S3_BUCKET env is missing");
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return buildObjectUrl(key);
};

export const getObject = async (key: string) => {
  if (!BUCKET) {
    throw new Error("AWS_S3_BUCKET env is missing");
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  } satisfies GetObjectCommandInput);

  return s3Client.send(command);
};

export const deleteObject = async (key: string) => {
  if (!BUCKET) {
    throw new Error("AWS_S3_BUCKET env is missing");
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  } satisfies DeleteObjectCommandInput);

  await s3Client.send(command);
};

export const listObjects = async (prefix?: string) => {
  if (!BUCKET) {
    throw new Error("AWS_S3_BUCKET env is missing");
  }

  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  } satisfies ListObjectsV2CommandInput);

  const response = await s3Client.send(command);
  return response.Contents ?? [];
};
