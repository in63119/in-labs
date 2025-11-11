import { NextRequest } from "next/server";
import { fromException } from "@/server/errors/exceptions";
import { visitorStorage, wallet, byte32 } from "@/lib/ethersClient";
import { getAdminCode } from "@/server/modules/auth/auth.service";
import { sha256 } from "@/lib/crypto";

type VisitorRecord = {
  ip: string;
  visits: number;
  lastVisitedAt: number;
};

const visitorStore = new Map<string, VisitorRecord>();

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

export const getVisitorCount = () => visitorStore.size;

export const hasVisited = async (ip: string) => {
  try {
    const address = await wallet(getAdminCode()).getAddress();
    const dayId = await currentDayId();
    const ipHash = `0x${sha256(ip)}`;

    return await visitorStorage.hasSeenHash(address, dayId, ipHash);
  } catch (error) {
    throw fromException("Visitor", "FAILED_TO_CHECK_VISIT");
  }
};

export const upsertVisitor = (ip: string) => {
  const now = Date.now();
  const existing = visitorStore.get(ip);

  if (existing) {
    const record: VisitorRecord = {
      ...existing,
      visits: existing.visits + 1,
      lastVisitedAt: now,
    };
    visitorStore.set(ip, record);
    return record;
  }

  const record: VisitorRecord = {
    ip,
    visits: 1,
    lastVisitedAt: now,
  };
  visitorStore.set(ip, record);
  return record;
};

export const getVisitor = (ip: string) => visitorStore.get(ip);
