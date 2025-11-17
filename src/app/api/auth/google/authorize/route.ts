import { NextResponse } from "next/server";

import { createErrorResponse } from "@/server/errors/response";
import { buildGmailOAuthConsentUrl } from "@/server/modules/google/config";

export async function GET() {
  try {
    const authUrl = await buildGmailOAuthConsentUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    return createErrorResponse(error);
  }
}
