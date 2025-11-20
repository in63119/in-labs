"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getSubscribers } from "@/lib/subscribeClient";
import { useAdminAuth } from "@/providers/AdminAuthProvider";
import type { SubscriberListResponse } from "@/common/types";

const isSubscriberListResponse = (
  value: unknown
): value is SubscriberListResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { subscribers?: unknown }).subscribers)
  );
};

export default function SubscriberListPanel() {
  const { adminCode } = useAdminAuth();
  const [subscribers, setSubscribers] = useState<string[]>([]);
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
      setSubscribers([]);
      setError("관리자 인증을 먼저 완료해주세요.");
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getSubscribers(adminCode as string);
        if (cancelled) {
          return;
        }

        if (!isSubscriberListResponse(response)) {
          const message =
            (response as { message?: string })?.message ??
            "구독자 목록을 불러오지 못했습니다.";
          setError(message);
          setSubscribers([]);
          return;
        }

        setSubscribers(response.subscribers);
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "구독자 목록을 불러오지 못했습니다.";
          setError(message);
          setSubscribers([]);
        }
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
          관리자 인증 후 구독자 이메일 목록을 확인할 수 있습니다.
        </p>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`subscriber-skeleton-${index}`}
              className="h-10 animate-pulse rounded-lg bg-[var(--color-charcoal)]/60"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-sm text-red-400">{error}</p>;
    }

    if (subscribers.length === 0) {
      return (
        <p className="text-sm text-[var(--color-ink)]">
          아직 등록된 구독자가 없습니다.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-subtle)]">
          총 {subscribers.length.toLocaleString()}명
        </p>
        <ul className="space-y-2">
          {subscribers.map((email) => (
            <li
              key={email}
              className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)]/40 px-4 py-3 text-sm text-white"
            >
              {email}
            </li>
          ))}
        </ul>
      </div>
    );
  }, [canFetch, error, isLoading, subscribers]);

  return (
    <div className="space-y-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">구독자 목록</h2>
          <p className="text-sm text-[var(--color-ink)]">
            이메일 인증을 마친 구독자 계정을 확인하세요.
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
