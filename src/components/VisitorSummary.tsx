"use client";

import { useEffect, useRef, useState } from "react";
import {
  ensureVisit,
  getVisitorCount,
  hasVisitFlag,
} from "@/lib/visitorClient";
import { getSubscriberCount } from "@/lib/subscribeClient";
import SubscribeModal from "./SubscribeModal";

type VisitorSummaryProps = {
  variant?: "card" | "inline";
};

export default function VisitorSummary({
  variant = "card",
}: VisitorSummaryProps) {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visitedRef = useRef(hasVisitFlag());

  const clearFallbackTimer = () => {
    if (!timeoutRef.current) {
      return;
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  useEffect(() => {
    const controller = new AbortController();

    const handleVisitor = async () => {
      const urlPath = `${window.location.pathname}${window.location.search}`;
      if (urlPath.length === 0) {
        return;
      }

      const visitResult = await ensureVisit(controller.signal, urlPath);
      if (visitResult && !("message" in visitResult)) {
        visitedRef.current = true;
      }

      const res = await getVisitorCount();
      if (!res || !("count" in res)) {
        return;
      }

      clearFallbackTimer();
      setVisitorCount(res.count);

      const subscriberRes = await getSubscriberCount();
      if (subscriberRes && "count" in subscriberRes) {
        setSubscriberCount(subscriberRes.count);
      }
    };

    void handleVisitor();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setHasTimedOut(true), 90_000);

    return () => {
      clearFallbackTimer();
    };
  }, []);

  const displayValue = visitorCount ?? (hasTimedOut ? "오늘 발행 없음" : "—");
  const subscriberDisplayValue = subscriberCount ?? "—";

  if (variant === "inline") {
    return (
      <div className="flex items-baseline gap-2 text-white">
        <span className="text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
          Today
        </span>
        <span className="text-lg font-semibold">{displayValue}</span>
      </div>
    );
  }

  return (
    <>
      <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5 space-y-4">
        <div className="space-y-4 text-white">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold">Today</h3>
            <p className="text-3xl font-bold">{displayValue}</p>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-[color:var(--color-subtle)]">
              Subscribers
            </span>
            <span className="text-3xl font-bold">{subscriberDisplayValue}</span>
          </div>
        </div>
        <SubscribeModal />
      </section>
    </>
  );
}
