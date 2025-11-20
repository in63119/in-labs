import { NextRequest, NextResponse } from "next/server";

import { wallet } from "@/lib/ethersClient";
import { createErrorResponse } from "@/server/errors/response";
import { getSubscribers } from "@/server/modules/subscribe/subscribe.service";

type SubscriberListRequest = {
  adminCode?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request
      .json()
      .catch(() => null)) as SubscriberListRequest | null;

    const adminCode = body?.adminCode?.trim();
    if (!adminCode) {
      return NextResponse.json(
        {
          message: "관리자 코드가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const address = await wallet(adminCode).getAddress();
    const subscribers = await getSubscribers(address);

    return NextResponse.json({ subscribers });
  } catch (error) {
    return createErrorResponse(error);
  }
}
