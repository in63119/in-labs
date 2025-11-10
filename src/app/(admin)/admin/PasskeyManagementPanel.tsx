"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PasskeySummary } from "@/common/types";
import { fetchPasskeys } from "@/lib/authClient";
import { useAdminAuth } from "@/providers/AdminAuthProvider";

const truncate = (value: string, lead = 8, tail = 6) => {
  if (value.length <= lead + tail + 3) {
    return value;
  }
  return `${value.slice(0, lead)}…${value.slice(-tail)}`;
};

const shortAddress = (address: string) => {
  if (address.length <= 10) {
    return address;
  }
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
};

const formatTransports = (transports: string[]) => {
  if (!transports.length) {
    return "없음";
  }
  return transports.join(", ");
};

const formatBackedUp = (value: boolean | null | undefined) => {
  if (value === true) {
    return "예";
  }
  if (value === false) {
    return "아니요";
  }
  return "미상";
};

const toDeviceLabel = (value: string | null | undefined) => {
  if (!value) {
    return "장치 정보 없음";
  }
  switch (value) {
    case "multiDevice":
      return "다중 기기";
    case "singleDevice":
      return "단일 기기";
    default:
      return value;
  }
};

const formatOs = (value: string | null | undefined) => {
  if (!value) {
    return "알 수 없음";
  }
  return value;
};

export default function PasskeyManagementPanel() {
  const { adminCode } = useAdminAuth();
  const [passkeys, setPasskeys] = useState<PasskeySummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const canFetch = Boolean(adminCode);

  const handleRefresh = useCallback(() => {
    if (!canFetch) {
      return;
    }
    setRefreshNonce((value) => value + 1);
  }, [canFetch]);

  useEffect(() => {
    let cancelled = false;

    if (!canFetch) {
      setPasskeys([]);
      setError("관리자 인증을 먼저 완료해주세요.");
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchPasskeys(adminCode as string);
        if (cancelled) {
          return;
        }
        setPasskeys(response.passkeys);
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "패스키 목록을 불러오지 못했습니다.";
        setError(message);
        setPasskeys([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [adminCode, canFetch, refreshNonce]);

  const content = useMemo(() => {
    if (!canFetch) {
      return (
        <p className="text-sm text-[var(--color-ink)]">
          관리자 인증에 성공하면 AuthStorage에 저장된 패스키를 확인할 수 있습니다.
        </p>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-lg bg-[var(--color-charcoal)]/60"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-sm text-red-400">{error}</p>;
    }

    if (passkeys.length === 0) {
      return (
        <p className="text-sm text-[var(--color-ink)]">
          등록된 패스키가 없습니다. 새로운 기기를 등록해보세요.
        </p>
      );
    }

    return (
      <ul className="space-y-3">
        {passkeys.map((passkey) => (
          <li
            key={`${passkey.address}-${passkey.credentialId}`}
            className="space-y-2 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)]/40 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white">
              <span
                className="font-mono text-xs md:text-sm"
                title={passkey.credentialId}
              >
                {truncate(passkey.credentialId)}
              </span>
              <span className="text-xs text-[var(--color-subtle)]">
                {toDeviceLabel(passkey.deviceType)}
              </span>
            </div>
            <dl className="grid gap-2 text-xs text-[var(--color-ink)] md:grid-cols-2">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--color-subtle)]">주소</dt>
                <dd className="font-mono text-white">
                  <span title={passkey.address}>
                    {shortAddress(passkey.address)}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--color-subtle)]">Transports</dt>
                <dd className="text-white">
                  {formatTransports(passkey.transports)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--color-subtle)]">카운터</dt>
                <dd className="text-white">
                  {passkey.counter.toLocaleString("ko-KR")}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--color-subtle)]">백업</dt>
                <dd className="text-white">{formatBackedUp(passkey.backedUp)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[var(--color-subtle)]">OS</dt>
                <dd className="text-white">{formatOs(passkey.osLabel)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    );
  }, [canFetch, error, isLoading, passkeys]);

  return (
    <div className="space-y-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">패스키 관리</h2>
          <p className="text-sm text-[var(--color-ink)]">
            AuthStorage에 등록된 패스키를 확인하고 상태를 점검하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={!canFetch || isLoading}
          className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-sm text-[var(--color-ink)] transition-colors hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          새로고침
        </button>
      </div>
      {content}
    </div>
  );
}
