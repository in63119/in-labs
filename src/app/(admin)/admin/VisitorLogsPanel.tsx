"use client";

import { useEffect, useState } from "react";
import { getVisitorLogs } from "@/lib/visitorClient";
import type { VisitorLog } from "@/common/types";

export default function VisitorLogsPanel() {
  const [visits, setVisits] = useState<VisitorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVisits = async () => {
    setIsLoading(true);
    setError(null);
    const res = await getVisitorLogs(100);
    if (!res || "message" in res) {
      setError(res?.message ?? "방문자 로그를 불러오지 못했습니다.");
      setIsLoading(false);
      return;
    }
    setVisits(res.visits);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadVisits();
  }, []);

  return (
    <div className="space-y-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">방문자 목록</h2>
          <p className="text-sm text-[var(--color-ink)]">
            오늘 기록된 방문 경로를 최신순으로 보여줍니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadVisits()}
          disabled={isLoading}
          className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] px-3 py-1.5 text-sm text-[var(--color-ink)] transition-colors hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          새로고침
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-[var(--color-subtle)]">불러오는 중...</p>
      ) : visits.length === 0 ? (
        <p className="text-sm text-[var(--color-subtle)]">
          아직 오늘 기록된 방문이 없습니다.
        </p>
      ) : (
        <div className="max-h-80 overflow-auto rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)]">
          <table className="min-w-full text-sm text-white">
            <thead className="sticky top-0 bg-[var(--color-charcoal-plus)] text-left text-[var(--color-subtle)]">
              <tr>
                <th className="px-4 py-3 font-medium">순번</th>
                <th className="px-4 py-3 font-medium">경로</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr
                  key={visit.index}
                  className="border-t border-[var(--color-border-strong)]"
                >
                  <td className="px-4 py-3 text-[var(--color-subtle)]">
                    #{visit.index + 1}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {visit.url || "/"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
