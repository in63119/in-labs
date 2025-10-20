import Link from "next/link";

export const metadata = {
  title: "Bible Lab | In Labs",
  description: "말씀 묵상과 짧은 에세이를 모아두는 공간",
};

type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags?: string[];
};

// 더미 목록: 나중에 MDX/DB 연동 시 대체
const POSTS: Post[] = [
  {
    slug: "2025-01-psalm-1-meditation",
    title: "시편 1편 묵상: 흐르는 물가에 심은 나무",
    date: "2025-01-05",
    summary: "말씀 곁에 머무는 삶의 이미지를 떠올리며 짧게 묵상.",
    tags: ["묵상", "시편", "삶"],
  },
  {
    slug: "2025-02-matthew-5-beatitudes",
    title: "마태복음 5장 행복선언: 복의 방향",
    date: "2025-02-10",
    summary: "심령이 가난한 자에게 시작된 복, 삶의 방향을 재정렬한다.",
    tags: ["마태복음", "산상수훈", "행복"],
  },
];

export default function BibleLabIndex() {
  return (
    <section className="space-y-6 text-white">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Bible Lab</h1>
        <p className="text-[color:var(--color-subtle)]">
          말씀을 읽고, 짧게 기록합니다. 아래 글부터 천천히 읽어보세요.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {POSTS.map((post) => (
          <li
            key={post.slug}
            className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-5 py-4 transition"
          >
            <time className="block text-xs text-[color:var(--color-subtle)]">
              {post.date}
            </time>
            <h2 className="mt-1 text-lg font-semibold text-white">
              <Link
                href={`/bible-lab/posts/${post.slug}`}
                className="hover:text-[#F2D74B]"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
              {post.summary}
            </p>
            {post.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[color:var(--color-badge-bg)] px-2 py-1 text-xs text-[#F2D74B]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="text-sm text-[color:var(--color-subtle)]">
        ※ 지금은 더미 데이터입니다. 나중에 MDX를 읽어오는 로직으로 교체할 수
        있어요.
      </div>
    </section>
  );
}
