import { wallet } from "@/lib/ethersClient";
import { fromException } from "@/server/errors/exceptions";
import { putObject } from "../aws/s3";

const toPathSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

export const uploadImage = async (formData: FormData) => {
  const file = formData.get("file");
  const adminCode = formData.get("adminCode");
  const labName = formData.get("labName");
  const slug = formData.get("slug");

  if (!(file instanceof File)) {
    throw fromException("Media", "NO_IMAGE_FILE");
  }

  if (!adminCode || typeof adminCode !== "string") {
    throw fromException("Auth", "INVALID_AUTH_CODE");
  }

  const address = await wallet(adminCode).getAddress();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("Z", "");

  const labSegment =
    typeof labName === "string" && labName.trim().length > 0
      ? toPathSegment(labName)
      : "lab";
  const slugSegment =
    typeof slug === "string" && slug.trim().length > 0
      ? toPathSegment(slug)
      : "media";

  const extension = (() => {
    const parts = file.name.split(".");
    return parts.length > 1 ? parts.pop()!.toLowerCase() : "png";
  })();

  const key = `users/${address}/media/${labSegment}/${slugSegment}/${timestamp}.${extension}`;

  const url = await putObject(
    key,
    buffer,
    file.type || "application/octet-stream"
  );

  return { url, key };
};
