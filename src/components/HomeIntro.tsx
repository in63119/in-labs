import Link from "next/link";

export default function HomeIntro() {
  return (
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
        테크, 데브 등 여러가지 주제를 번갈아 탐구하며 배운 것을 정리합니다. 각
        실험실에서 진행 중인 프로젝트와 어록을 보고 싶다면 클릭하세요.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[color:var(--color-subtle)]">
        <span className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2">
          기술 실험 · 데브노트
        </span>
        <span className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2">
          블로그 제작 · 운영 기록
        </span>
        <span className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2">
          레시피 메모 · 재료 기록
        </span>
        {/* <span className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2">
          말씀 묵상 · 신앙 아카이브
        </span> */}
      </div>
    </Link>
  );
}
