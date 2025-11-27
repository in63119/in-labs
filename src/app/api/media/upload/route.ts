import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { uploadImage } from "@/server/modules/media/image.service";

// Increase the request body limit for image uploads to avoid 413 errors.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

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
