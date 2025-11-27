import { NextRequest, NextResponse } from "next/server";
import {
  deleteObjectInMomBucket,
  listObjectsInMomBucket,
  putObjectInMomBucket,
  getMomBucketName,
} from "@/server/modules/aws/s3";

const toError = (error: unknown) =>
  error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

export async function GET() {
  try {
    const momBucket = await getMomBucketName();
    const contents = await listObjectsInMomBucket();

    const serialized =
      contents?.map((item) => ({
        key: item.Key ?? "",
        size: item.Size,
        lastModified: item.LastModified?.toISOString(),
        url: item.Key ? `https://${momBucket}.s3.amazonaws.com/${item.Key}` : null,
      })) ?? [];

    return NextResponse.json({
      ok: true,
      contents: serialized,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: toError(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData
      .getAll("file")
      .filter((item): item is File => item instanceof File);
    const keyInput = formData.get("key");

    if (files.length === 0) {
      return NextResponse.json(
        { ok: false, message: "업로드할 파일이 필요합니다." },
        { status: 400 }
      );
    }

    const uploaded = [];

    for (const file of files) {
      const key =
        typeof keyInput === "string" && keyInput.trim().length > 0
          ? keyInput.trim()
          : file.name;
      const arrayBuffer = await file.arrayBuffer();
      const body = Buffer.from(arrayBuffer);
      const url = await putObjectInMomBucket(
        key,
        body,
        file.type || undefined
      );
      uploaded.push({ key, url });
    }

    return NextResponse.json({ ok: true, uploaded });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: toError(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const key = typeof body?.key === "string" ? body.key : null;

    if (!key) {
      return NextResponse.json(
        { ok: false, message: "삭제할 파일 키가 필요합니다." },
        { status: 400 }
      );
    }

    await deleteObjectInMomBucket(key);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: toError(error) },
      { status: 500 }
    );
  }
}
