"use client";

import { useEffect } from "react";
import { trackVisitor } from "@/lib/visitorClient";

type VisitorSummaryProps = {
  count?: number;
};

export default function VisitorSummary({ count = 0 }: VisitorSummaryProps) {
  useEffect(() => {
    const controller = new AbortController();

    const handleVisitor = async () => {
      const { visited } = await trackVisitor(controller.signal);
      if (visited) {
        return;
      }
    };

    void handleVisitor();

    return () => controller.abort();
  }, []);
  return (
    <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5">
      <h3 className="font-semibold text-white">방문자</h3>
      <p className="mt-2 text-3xl font-bold text-white">{count}</p>
    </section>
  );
}
