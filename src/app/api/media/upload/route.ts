import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { uploadImage } from "@/server/modules/media/image.service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const { url, key } = await uploadImage(formData);

    return NextResponse.json({
      ok: true,
      url,
      key,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
