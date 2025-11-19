import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { fromException } from "@/server/errors/exceptions";
import { verifyPinCode } from "@/server/modules/email/email.service";
import { wallet } from "@/lib/ethersClient";
import { getAdminCode } from "@/server/modules/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as {
      pinCode: string;
    } | null;
    if (!body) {
      throw fromException("Auth", "MISSING_EMAIL");
    }

    const { pinCode } = body;
    const address = await wallet(getAdminCode()).getAddress();

    const verified = await verifyPinCode(address, pinCode);

    return NextResponse.json({ verified });
  } catch (error) {
    console.error("Error in pin verify route:", error);
    return createErrorResponse(error);
  }
}
