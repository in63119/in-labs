import { NextRequest, NextResponse } from "next/server";

import { generateGeminiText } from "@/server/modules/google/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { ok: false, message: "prompt 값이 필요합니다." },
        { status: 400 }
      );
    }

    const text = await generateGeminiText(prompt);

    return NextResponse.json({ ok: true, text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gemini 요청에 실패했습니다.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
