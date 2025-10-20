export default function YouTubeHub() {
  return (
    <section className="space-y-6 text-white">
      <header>
        <h1 className="text-2xl font-bold text-white">YouTube 채널</h1>
        <p className="text-[color:var(--color-subtle)]">
          채널 소개 한두 문장 + 채널 운영 취지, 시리즈 설명. 각 영상엔 핵심
          요약/타임스탬프를 제공합니다.
        </p>
      </header>

      <article className="grid gap-6 md:grid-cols-2">
        {/* 각 카드에 영상 iframe + 텍스트 설명(요약/포인트) */}
        <div className="space-y-3 rounded-xl border border-[#2A2A2A] bg-[#1E1E1E] p-4 shadow-[var(--shadow-card)]">
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="YouTube video"
              allowFullScreen
            />
          </div>
          <h2 className="font-semibold text-white">영상 제목</h2>
          <ul className="list-disc pl-5 text-sm text-[color:var(--color-subtle)]">
            <li className="text-[color:var(--color-subtle)]">요약 포인트 1</li>
            <li className="text-[color:var(--color-subtle)]">요약 포인트 2</li>
          </ul>
        </div>
        {/* … */}
      </article>
    </section>
  );
}
