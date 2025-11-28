import { NextResponse } from "next/server";

import { listAvailableGeminiModels } from "@/server/modules/google/gemini";

export async function GET() {
  try {
    const models = await listAvailableGeminiModels();
    return NextResponse.json({ ok: true, models });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gemini ListModels 요청에 실패했습니다.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
