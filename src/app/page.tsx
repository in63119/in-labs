// app/page.tsx
import AdSlot from "@/components/AdSlot";

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
      {/* Left: List */}
      <section className="space-y-6">
        {/* 카드 1~3 */}
        {[1, 2, 3].map((i) => (
          <article
            key={i}
            className="rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-4 shadow-[var(--shadow-card)]"
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
          className="rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-4"
        />

        {/* 카드 4~8 */}
        {[4, 5, 6, 7, 8].map((i) => (
          <article
            key={i}
            className="rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-4 shadow-[var(--shadow-card)]"
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
          className="rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-4"
        />
      </section>

      {/* Right: Sidebar (데스크톱 전용) */}
      <aside className="hidden lg:block space-y-6">
        <section className="rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-4 shadow-[var(--shadow-card)]">
          <h3 className="font-semibold text-white">구독</h3>
          <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
            이메일 구독 폼 또는 소개
          </p>
        </section>

        {/* 사이드바 광고 */}
        <AdSlot
          slotId="YOUR_SLOT_ID_SIDEBAR"
          minHeight={250}
          className="rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-4"
        />
      </aside>
    </div>
  );
}
