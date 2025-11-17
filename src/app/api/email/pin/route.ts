import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { fromException } from "@/server/errors/exceptions";
import {
  generateFourDigitCode,
  claimPinCode,
} from "@/server/modules/email/email.service";
import { wallet } from "@/lib/ethersClient";
import { getAdminCode } from "@/server/modules/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email: string;
    } | null;
    if (!body) {
      throw fromException("Auth", "MISSING_EMAIL");
    }

    const { email } = body;
    const address = await wallet(getAdminCode()).getAddress();
    const pinCode = generateFourDigitCode().toString();

    await claimPinCode(address, pinCode, email);

    return NextResponse.json({ pinCode });
  } catch (error) {
    return createErrorResponse(error);
  }
}
