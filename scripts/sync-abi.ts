import path from "path";
import fs from "fs";
import {
  GetObjectCommand,
  S3Client,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const abisPrefix = "abis/";
const localBasePath = path.join(process.cwd(), "/src");
const s3 = new S3Client({
  region: process.env.AWS_S3_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});
const bucketName = process.env.AWS_S3_BUCKET || "";

const syncAbis = async () => {
  try {
    const objects = await listObjects(bucketName, abisPrefix);
    if (!objects || objects.length === 0) {
      console.log("No ABI files found in S3.");
      return;
    }

    for (const key of objects) {
      try {
        if (!key) continue;

        const fullPath = path.join(localBasePath, key);
        const abiPath = path.dirname(fullPath);

        fs.mkdirSync(abiPath, { recursive: true });

        const abi = await getObject(bucketName, key);
        if (typeof abi !== "string") continue;

        fs.writeFileSync(fullPath, abi);

        console.log(`Saved ABI file: ${fullPath}`);
      } catch (error) {
        console.error(error);
        continue;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const listObjects = async (bucketName: string, prefix: string) => {
  const objects: string[] = [];

  try {
    const paginator = paginateListObjectsV2(
      { client: s3 },
      { Bucket: bucketName, Prefix: prefix }
    );

    for await (const page of paginator) {
      const keys = page.Contents?.map((o) => o.Key).filter(
        (k): k is string => !!k
      );

      if (keys && keys.length > 0) {
        objects.push(...keys);
      }
    }

    return objects;
  } catch (error) {
    console.error(error);
  }
};

const getObject = async (bucketName: string, key: string) => {
  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
    if (!response.Body) {
      console.log("File not found");
      return;
    }

    const str = await response.Body.transformToString();
    return str;
  } catch (error) {
    console.error(error);
  }
};

syncAbis();
