export default function YouTubeHub() {
  return (
    <section className="space-y-6 text-white">
      <header>
        <h1 className="text-2xl font-bold text-white">YouTube 채널</h1>
        <p className="text-[color:var(--color-subtle)]">
          요리 좋아하는 커플의 놀이터
        </p>
        <p className="text-[color:var(--color-subtle)]">
          음식이 약이 되게하고, 약이 음식이 되게하라
        </p>
      </header>

      <article className="grid gap-6 md:grid-cols-2">
        {/* 각 카드에 영상 iframe + 텍스트 설명(요약/포인트) */}
        <div className="space-y-3 border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] p-5">
          <div className="aspect-video overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/I_MHJfm8l3Y"
              title="YouTube video"
              allowFullScreen
            />
          </div>
          <h2 className="font-semibold text-white">
            진천조하 [보탑사,김유신탄생지,청산가든]
          </h2>
          <ul className="list-disc pl-5 text-sm text-[color:var(--color-subtle)]">
            <li className="text-[color:var(--color-subtle)]">
              보탑사 3층 목탑!
            </li>
            <li className="text-[color:var(--color-subtle)]">
              백반기행에 나왔던 진천 맛집!
            </li>
          </ul>
        </div>
        {/* … */}
      </article>
    </section>
  );
}
