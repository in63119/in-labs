"use client";

import { useEffect, useState } from "react";
import { trackVisitor, visit, getVisitorCount } from "@/lib/visitorClient";

type VisitorSummaryProps = {
  variant?: "card" | "inline";
};

export default function VisitorSummary({
  variant = "card",
}: VisitorSummaryProps) {
  const [visitorCount, setVisitorCount] = useState(0);

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

      setVisitorCount(res.count);
    };

    void handleVisitor();

    return () => controller.abort();
  }, []);

  if (variant === "inline") {
    return (
      <div className="flex items-baseline gap-2 text-white">
        <span className="text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
          Today
        </span>
        <span className="text-lg font-semibold">{visitorCount}</span>
      </div>
    );
  }

  return (
    <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5">
      <h3 className="font-semibold text-white">Today</h3>
      <p className="mt-2 text-3xl font-bold text-white">{visitorCount}</p>
    </section>
  );
}
