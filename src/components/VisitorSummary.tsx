"use client";

import { useEffect, useRef, useState } from "react";
import { trackVisitor, visit, getVisitorCount } from "@/lib/visitorClient";
import SubscribeModal from "./SubscribeModal";

type VisitorSummaryProps = {
  variant?: "card" | "inline";
};

export default function VisitorSummary({
  variant = "card",
}: VisitorSummaryProps) {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const response = await trackVisitor(controller.signal);
      if (!response || "message" in response) {
        return;
      }

      if (!response.visited) {
        await visit(controller.signal);
      }

      const res = await getVisitorCount();
      if (!res || !("count" in res)) {
        return;
      }

      clearFallbackTimer();
      setVisitorCount(res.count);
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

  const displayValue =
    visitorCount ?? (hasTimedOut ? "오늘 발행 없음" : "—");

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
        <div className="flex items-baseline justify-between text-white">
          <h3 className="font-semibold">Today</h3>
          <p className="text-3xl font-bold">{displayValue}</p>
        </div>
        <SubscribeModal />
      </section>
    </>
  );
}
