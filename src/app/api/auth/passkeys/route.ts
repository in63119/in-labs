import { NextRequest, NextResponse } from "next/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/server";

import { wallet } from "@/lib/ethersClient";
import { createErrorResponse } from "@/server/errors/response";
import { getPasskeys } from "@/server/modules/auth/auth.service";
import type { NormalizedPasskey, PasskeySummary } from "@/common/types";

type PasskeyListRequest = {
  adminCode?: string;
};

const toTransportList = (
  transports: unknown
): AuthenticatorTransportFuture[] => {
  if (!Array.isArray(transports)) {
    return [];
  }

  return transports.filter(
    (transport): transport is AuthenticatorTransportFuture =>
      typeof transport === "string"
  );
};

const extractOsLabel = (passkey: NormalizedPasskey): string | null => {
  const metadata = passkey as Record<string, unknown>;
  const adminDeviceInfo = metadata["adminDeviceInfo"];
  if (
    adminDeviceInfo &&
    typeof adminDeviceInfo === "object" &&
    typeof (adminDeviceInfo as { os?: unknown }).os === "string"
  ) {
    return (adminDeviceInfo as { os: string }).os;
  }

  const detectedOs = metadata["detectedOs"];
  if (typeof detectedOs === "string") {
    return detectedOs;
  }

  return null;
};

const toPasskeySummary = (
  address: string,
  passkey: NormalizedPasskey
): PasskeySummary | null => {
  const credentialId =
    typeof passkey.credential?.idBase64Url === "string"
      ? passkey.credential.idBase64Url
      : typeof passkey.credential?.id === "string"
      ? passkey.credential.id
      : null;

  if (!credentialId) {
    return null;
  }

  const counter =
    typeof passkey.credential?.counter === "number"
      ? passkey.credential.counter
      : 0;

  const transports = toTransportList(passkey.credential?.transports);
  const deviceType =
    typeof passkey.credentialDeviceType === "string"
      ? passkey.credentialDeviceType
      : null;
  const backedUp =
    typeof passkey.credentialBackedUp === "boolean"
      ? passkey.credentialBackedUp
      : null;
  const osLabel = extractOsLabel(passkey);

  return {
    address,
    credentialId,
    transports,
    counter,
    deviceType,
    osLabel,
    backedUp,
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request
      .json()
      .catch(() => null)) as PasskeyListRequest | null;

    const adminCode = body?.adminCode?.trim();
    if (!adminCode) {
      return NextResponse.json(
        {
          ok: false,
          message: "관리자 코드가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const address = await wallet(adminCode).getAddress();
    const passkeys = await getPasskeys(address);

    const serialized = (passkeys ?? [])
      .map((passkey: NormalizedPasskey) => toPasskeySummary(address, passkey))
      .filter(
        (item: PasskeySummary | null): item is PasskeySummary => item !== null
      );

    return NextResponse.json({
      ok: true,
      passkeys: serialized,
    });
  } catch (error: unknown) {
    return createErrorResponse(error);
  }
}
