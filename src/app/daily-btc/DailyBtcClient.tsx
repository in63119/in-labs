"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import LoadingSpinner from "@/components/LoadingSpinner";
import { btcAnalysis } from "@/lib/geminiClient";
import AdSlot from "@/components/AdSlot";

type TickerResponse = {
  symbol: string;
  price: string;
};

export default function DailyBtcPage() {
  const [price, setPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const sanitizedAnalysis = useMemo(
    () => (analysis ? analysis.replace(/<br\s*\/?>/gi, "\n") : null),
    [analysis]
  );

  const kakaoTopAdUnit = "DAN-cGOkyG3oBycBI4m8";
  const kakaoBottomAdUnit = "DAN-24nYOm9lPUw8Cel0";

  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const fetchAnalysis = useCallback(
    async (currentPrice: string | null) => {
      setIsAnalysisLoading(true);
      setAnalysisError(null);
      try {
        const priceText = currentPrice
          ? `바이낸스 현물 기준 현재 BTC/USDT 가격: $${Number(
              currentPrice
            ).toLocaleString()}`
          : "현재 BTC/USDT 가격을 불러오지 못했습니다. 가격 관련 판단은 추정임.";

        const prompt = [
          "당신은 날짜 기반의 전문적인 비트코인(BTC) 시장 분석가입니다.",
          "",
          "[임무]",
          `${today} 날짜의 실제 시장 상황, 차트 컨텍스트, 뉴스/이벤트, 그리고 3가지 시나리오를 논리적으로 구성해야 합니다. 모든 값은 실제 시장 분석을 토대로 제공해야 합니다.`,
          "",
          "[출력 형식 제약]",
          "출력은 다음 5가지 섹션을 포함해야 하며, 모든 섹션은 Markdown 헤딩(##)과 표(Table) 형식을 사용하여 구조화되고 깔끔하게 정리되어야 합니다.",
          "",
          "1. ## 차트 컨텍스트",
          "2. ## 뉴스·이벤트",
          "3. ## 시나리오 2~3개",
          "4. ## 진입 의견 (택 2안)",
          "5. ## 체크리스트",
          "",
          "이 형식을 절대 변경해서는 안 됩니다.",
          "서론/인사말/불필요한 문장은 넣지 말고, 아래 섹션과 표만 출력하세요.",
          "",
          priceText,
          `오늘 날짜: ${today}`,
        ].join("\n");

        const res = await btcAnalysis(JSON.stringify({ prompt }));

        if (!res || !("text" in res)) {
          return;
        }

        setAnalysis(res.text);
      } catch (err) {
        setAnalysis(null);
        setAnalysisError(
          err instanceof Error ? err.message : "분석을 불러오지 못했습니다."
        );
      } finally {
        setIsAnalysisLoading(false);
      }
    },
    [today]
  );

  const fetchPriceAndAnalysis = useCallback(async () => {
    setIsLoading(true);
    let latestPrice: string | null = null;

    try {
      const res = await fetch(
        "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch price (${res.status})`);
      }
      const data = (await res.json()) as TickerResponse;
      latestPrice = data.price;
      setPrice(data.price);
    } catch {
      setPrice(null);
    } finally {
      setIsLoading(false);
      void fetchAnalysis(latestPrice);
    }
  }, [fetchAnalysis]);

  useEffect(() => {
    void fetchPriceAndAnalysis();
  }, [fetchPriceAndAnalysis]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12 text-white">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Daily BTC : {today}</h1>
        <p className="text-sm text-[var(--color-subtle)]">
          매일 비트코인(BTC) 시장 분석에 대한 정보를 확인할 수 있습니다.
        </p>
        <p className="text-sm text-[var(--color-subtle)]">
          투자는 각자의 책임입니다. 참고만 부탁드립니다.
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-[var(--color-subtle)]">
              현재 BTC/USDT
            </p>
            <p className="text-2xl font-semibold text-white">
              {price ? `$${Number(price).toLocaleString()}` : "-"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              void fetchPriceAndAnalysis();
            }}
            disabled={isLoading}
            className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] px-3 py-2 text-xs text-[var(--color-ink)] transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "불러오는 중..." : "새로고침"}
          </button>
        </div>
      </section>

      <AdSlot
        unitId={kakaoTopAdUnit}
        className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />

      <section className="space-y-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-[var(--color-subtle)]">
              오늘의 분석
            </p>
            <p className="text-sm text-[var(--color-ink)]">
              {today} 기준 비트코인(BTC) 시장 분석
            </p>
          </div>
        </div>
        {analysisError ? (
          <p className="text-sm text-red-400">{analysisError}</p>
        ) : isAnalysisLoading && !analysis ? (
          <div className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] p-6">
            <LoadingSpinner label="분석을 불러오는 중..." />
          </div>
        ) : sanitizedAnalysis ? (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {sanitizedAnalysis}
            </ReactMarkdown>
          </div>
        ) : null}
      </section>

      <AdSlot
        unitId={kakaoBottomAdUnit}
        className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </main>
  );
}
