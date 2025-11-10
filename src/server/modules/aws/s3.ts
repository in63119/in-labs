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
import getConfig from "@/common/config/default.config";
import { configReady } from "@/server/bootstrap/init";

type S3Resources = {
  client: S3Client;
  bucket: string;
  region?: string;
};

let s3ResourcesPromise: Promise<S3Resources> | null = null;

const resolveS3Resources = () => {
  if (!s3ResourcesPromise) {
    s3ResourcesPromise = (async () => {
      await configReady;
      const loadedConfig = getConfig();

      const bucket = loadedConfig.aws?.s3?.bucket ?? "";
      const region = process.env.AWS_REGION;
      const accessKeyId = loadedConfig.aws?.s3?.accessKey ?? "";
      const secretAccessKey = loadedConfig.aws?.s3?.secretKey ?? "";

      if (!bucket) {
        throw new Error("AWS_S3_BUCKET env is missing");
      }

      const credentials =
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined;

      return {
        client: new S3Client({
          region,
          credentials,
        }),
        bucket,
        region,
      };
    })();
  }

  return s3ResourcesPromise;
};

const buildObjectUrl = (
  bucket: string,
  region: string | undefined,
  key: string
) => {
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  if (!region || region === "us-east-1") {
    return `https://${bucket}.s3.amazonaws.com/${encodedKey}`;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
};

export const putObject = async (
  key: string,
  body: PutObjectCommandInput["Body"],
  contentType?: string
) => {
  const { client, bucket, region } = await resolveS3Resources();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await client.send(command);

  return buildObjectUrl(bucket, region, key);
};

export const getObject = async (key: string) => {
  const { client, bucket } = await resolveS3Resources();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  } satisfies GetObjectCommandInput);

  return client.send(command);
};

export const deleteObject = async (key: string) => {
  const { client, bucket } = await resolveS3Resources();

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  } satisfies DeleteObjectCommandInput);

  await client.send(command);
};

export const listObjects = async (prefix?: string) => {
  const { client, bucket } = await resolveS3Resources();

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  } satisfies ListObjectsV2CommandInput);

  const response = await client.send(command);
  return response.Contents ?? [];
};
