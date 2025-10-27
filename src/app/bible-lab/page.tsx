import Link from "next/link";
import type { Metadata } from "next";

import { biblePosts } from "@/lib/postData";
import WritePostButton from "@/components/WritePostButton";

export const metadata: Metadata = {
  title: "Bible Lab | In Labs",
  description:
    "시편과 복음서를 중심으로 짧은 묵상을 기록합니다. 하루를 정돈할 수 있는 질문과 실천 포인트를 함께 남깁니다.",
  alternates: {
    canonical: "/bible-lab",
  },
};

export default function BibleLabIndex() {
  return (
    <section className="space-y-6 text-white">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Bible Lab</h1>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-subtle)]">
            묵상 노트를 정리하며 오늘의 마음가짐을 다듬습니다. 본문 속에서 발견한 한 문장을 기록하고,
            실제 삶에서 적용할 작은 행동을 제안합니다.
          </p>
        </div>
        <WritePostButton labName="Bible Lab" />
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {biblePosts.map((post) => (
          <li
            key={post.slug}
            className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-5 py-4 transition"
          >
            <time
              className="block text-xs uppercase tracking-wide text-[color:var(--color-subtle)]"
              dateTime={post.date}
            >
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <h2 className="mt-1 text-lg font-semibold text-white">
              <Link href={post.href} className="transition-colors hover:text-[color:var(--color-accent)]">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-subtle)]">{post.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
