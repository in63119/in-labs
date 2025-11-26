import { NextRequest } from "next/server";
import { fromException } from "@/server/errors/exceptions";
import { visitorStorage, wallet, sendTxByRelayer } from "@/lib/ethersClient";
import { getAdminCode } from "@/server/modules/auth/auth.service";
import { sha256 } from "@/lib/crypto";
import { CONTRACT_NAME } from "@/common/enums";
import type { VisitorLog } from "@/common/types";

export const getClientIp = (request: NextRequest, fallback?: string | null) => {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    (request as unknown as { ip?: string }).ip ??
    fallback ??
    null
  );
};

const currentDayId = async () => {
  try {
    return await visitorStorage.currentDayId();
  } catch {
    throw fromException("Visitor", "FAILED_TO_GET_DAY_ID");
  }
};

export const getVisitorCount = async () => {
  try {
    const address = await wallet(getAdminCode()).getAddress();
    const dayId = await currentDayId();

    return await visitorStorage.totalVisitorsOf(address, dayId);
  } catch {
    throw fromException("Visitor", "FAILED_TO_GET_VISIT_COUNT");
  }
};

export const hasVisited = async (ip: string) => {
  try {
    const address = await wallet(getAdminCode()).getAddress();
    const dayId = await currentDayId();
    const ipHash = `0x${sha256(ip)}`;

    return await visitorStorage.hasSeenHash(address, dayId, ipHash);
  } catch {
    throw fromException("Visitor", "FAILED_TO_CHECK_VISIT");
  }
};

export const visit = async (ip: string, url?: string) => {
  const address = await wallet(getAdminCode()).getAddress();
  const ipHash = `0x${sha256(ip)}`;
  const targetUrl = url?.trim() || "/";

  try {
    const receipt = await sendTxByRelayer({
      contract: CONTRACT_NAME.VISITORSTORAGE,
      method: "addHashedVisitorForToday",
      arg: [address, ipHash, targetUrl],
    });

    const event = receipt.logs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((log: any) => visitorStorage.interface.parseLog(log))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .find((parsed: any) => parsed?.name === "HashedVisitorRecorded");
    if (!event) {
      throw fromException("Visitor", "FAILED_TO_ADD_VISIT");
    }
  } catch {
    throw fromException("Visitor", "FAILED_TO_ADD_VISIT");
  }
};

export const getVisitLogs = async (limit = 50): Promise<VisitorLog[]> => {
  const address = await wallet(getAdminCode()).getAddress();
  const dayId = await currentDayId();

  const total = Number(await visitorStorage.hashedVisitorCount(address, dayId));
  if (!Number.isFinite(total) || total <= 0) {
    return [];
  }

  const startIndex = Math.max(0, total - limit);

  const urls = await Promise.all(
    Array.from({ length: total - startIndex }, (_, idx) =>
      visitorStorage.visitUrlAt(address, dayId, startIndex + idx)
    )
  );

  return urls
    .map((url: string, offset: number) => ({
      index: startIndex + offset,
      url,
    }))
    .reverse();
};
