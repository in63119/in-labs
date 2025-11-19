import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/server/errors/response";
import { fromException } from "@/server/errors/exceptions";
import { wallet } from "@/lib/ethersClient";
import {
  addSubscribe,
  getSubscriberCount,
} from "@/server/modules/subscribe/subscribe.service";
import { getAdminCode } from "@/server/modules/auth/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as {
      email: string;
    } | null;
    if (!body) {
      throw fromException("Subscriber", "MISSING_EMAIL");
    }

    const { email } = body;
    const address = await wallet(getAdminCode()).getAddress();

    const subscribed = await addSubscribe(address, email);

    return NextResponse.json({ subscribed });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function GET() {
  try {
    const count = await getSubscriberCount();
    return NextResponse.json({ count });
  } catch (error) {
    return createErrorResponse(error);
  }
}
