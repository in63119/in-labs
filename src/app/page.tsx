// app/page.tsx
import Link from "next/link";

import AdSlot from "@/components/AdSlot";

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
      {/* Left column */}
      <div className="space-y-6">
        <Link
          href="/about"
          aria-label="In Labs 소개 페이지로 이동"
          className="block overflow-hidden rounded-3xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-7 py-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-badge-bg)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-accent)]">
            In Labs 소개
          </div>
          <h1 className="mt-5 text-3xl font-bold text-white">
            실험과 기록을 좋아하는 퍼스널 랩
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--color-subtle)]">
            테크, 푸드, 바이블 세 가지 주제를 번갈아 탐구하며 배운 것을
            정리합니다. 각 실험실에서 진행 중인 프로젝트와 어록을 보고 싶다면
            클릭하세요.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[color:var(--color-subtle)]">
            <span className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2">
              기술 실험 · 데브노트
            </span>
            <span className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2">
              레시피 메모 · 재료 기록
            </span>
            <span className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2">
              말씀 묵상 · 신앙 아카이브
            </span>
          </div>
        </Link>

        {/* Post feed */}
        <section className="space-y-6">
          {/* 카드 1~3 */}
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
            >
              <h2 className="text-xl font-semibold">글 제목 {i}</h2>
              <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
                이곳에 스니펫/요약이 들어갑니다. 2~3문장 정도가 적당합니다.
              </p>
            </article>
          ))}

          {/* 인피드 광고 #1 (문단/카드 사이) */}
          <AdSlot
            slotId="YOUR_SLOT_ID_INFEED_1"
            minHeight={300}
            className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
          />

          {/* 카드 4~8 */}
          {[4, 5, 6, 7, 8].map((i) => (
            <article
              key={i}
              className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
            >
              <h2 className="text-xl font-semibold">글 제목 {i}</h2>
              <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
                추가 카드 예시. 카드 3~5개마다 인피드 광고 1칸 권장.
              </p>
            </article>
          ))}

          {/* 인피드 광고 #2 */}
          <AdSlot
            slotId="YOUR_SLOT_ID_INFEED_2"
            minHeight={300}
            className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
          />
        </section>
      </div>

      {/* Right: Sidebar (데스크톱 전용) */}
      <aside className="hidden lg:block space-y-6">
        <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5">
          <h3 className="font-semibold text-white">구독</h3>
          <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
            이메일 구독 폼 또는 소개
          </p>
        </section>

        {/* 사이드바 광고 */}
        <AdSlot
          slotId="YOUR_SLOT_ID_SIDEBAR"
          minHeight={250}
          className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
        />
      </aside>
    </div>
  );
}
