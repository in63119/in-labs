"use server";

import "server-only";

import { configReady } from "@/server/bootstrap/init";

import getConfig from "@/common/config/default.config";

const GEMINI_API_VERSION = "v1";
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent`;

type GeminiContentPart = {
  text?: string;
};

type GeminiCandidate = {
  content?: {
    parts?: GeminiContentPart[];
  };
  finishReason?: string;
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
};

export async function generateGeminiText(prompt: string) {
  await configReady;
  const geminiApiKey = getConfig().google?.geminiApiKey;

  if (!geminiApiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${geminiApiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini request failed: ${res.status} ${errorText}`);
  }

  const data = (await res.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;

  if (!text) {
    throw new Error("Gemini returned no text content.");
  }

  return text;
}

export async function listAvailableGeminiModels() {
  await configReady;
  const geminiApiKey = getConfig().google?.geminiApiKey;

  if (!geminiApiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models?key=${geminiApiKey}`
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini ListModels failed: ${res.status} ${errorText}`);
  }

  return res.json();
}
