import AdSlot from "@/components/AdSlot";

export default function HomePostFeed() {
  return (
    <section className="space-y-6">
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

      <AdSlot
        slotId="YOUR_SLOT_ID_INFEED_1"
        minHeight={300}
        className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />

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

      <AdSlot
        slotId="YOUR_SLOT_ID_INFEED_2"
        minHeight={300}
        className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </section>
  );
}
