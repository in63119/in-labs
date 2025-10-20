// app/tech-lab/[slug]/page.tsx
import AdSlot from "@/components/AdSlot";

export default function PostPage() {
  return (
    <article className="mx-auto max-w-[720px] space-y-6 text-white">
      <h1 className="text-3xl font-bold text-white">제목</h1>
      <p className="text-[color:var(--color-subtle)]">
        리드문(핵심 요약 1~2문장).
      </p>

      <p className="text-base text-[color:var(--color-subtle)]">문단 1…</p>
      <p className="text-base text-[color:var(--color-subtle)]">문단 2…</p>

      {/* 인아티클 광고 #1 (문단 사이, 위아래 여백 충분히) */}
      <AdSlot
        slotId="YOUR_SLOT_ID_INARTICLE_1"
        minHeight={320}
        className="my-6 border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />

      <p className="text-base text-[color:var(--color-subtle)]">
        문단 3~5… 이미지/코드/인용 등
      </p>

      {/* 인아티클 광고 #2 */}
      <AdSlot
        slotId="YOUR_SLOT_ID_INARTICLE_2"
        minHeight={320}
        className="my-6 border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />

      <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5">
        <h2 className="font-semibold text-white">관련 글</h2>
        <ul className="list-disc pl-5 text-sm text-[color:var(--color-subtle)]">
          <li className="text-[color:var(--color-subtle)]">관련 글 A</li>
          <li className="text-[color:var(--color-subtle)]">관련 글 B</li>
        </ul>
      </section>

      {/* 하단 광고(피니셔) */}
      <AdSlot
        slotId="YOUR_SLOT_ID_BOTTOM"
        minHeight={250}
        className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </article>
  );
}
