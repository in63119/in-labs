import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { fromException } from "@/server/errors/exceptions";
import { createErrorResponse } from "@/server/errors/response";
import {
  getRpID,
  generateAuthenticaterOptions,
} from "@/server/modules/auth/webAuthn";
import { passkeyStorage, relayer, wallet } from "@/lib/ethersClient";

export async function POST(request: NextRequest) {
  const rpId = getRpID();
  if (!rpId) {
    throw fromException("Auth", "INVALID_ORIGIN");
  }

  try {
    const { email } = await request.json();

    const userWallet = wallet(email);
    const contract = passkeyStorage.connect(relayer);
    const balanceOfPasskeys = Number(
      await contract.balanceOf(userWallet.address)
    );
    if (balanceOfPasskeys === 0) {
      throw fromException("User", "USER_NOT_FOUND");
    }

    const passkeys = await contract.getPasskeys(userWallet.address);

    const { options, jwt } = await generateAuthenticaterOptions(
      email,
      passkeys
    );

    const cookieStore = cookies();
    (await cookieStore).set("webauthn-authentication", jwt, {
      httpOnly: true,
      maxAge: 120,
      sameSite: "lax",
    });

    return NextResponse.json({
      ok: true,
      options,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
