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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

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
    <>
      <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5 space-y-4">
        <div>
          <h3 className="font-semibold text-white">Today</h3>
          <p className="mt-2 text-3xl font-bold text-white">{visitorCount}</p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="w-full rounded-lg border border-[color:var(--color-border-strong)] px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
        >
          구독하기
        </button>
      </section>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] p-6 text-white">
            <h4 className="text-lg font-semibold">구독하기</h4>
            <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
              구독 기능이 준비 중입니다.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-[color:var(--color-border-strong)] px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
