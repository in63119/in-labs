"use client";

import { useEffect, useState } from "react";
import { trackVisitor, visit, getVisitorCount } from "@/lib/visitorClient";

export default function VisitorSummary() {
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
  return (
    <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5">
      <h3 className="font-semibold text-white">Today</h3>
      <p className="mt-2 text-3xl font-bold text-white">{visitorCount}</p>
    </section>
  );
}
