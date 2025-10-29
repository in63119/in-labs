import Link from "next/link";
import type { Metadata } from "next";

import WritePostButton from "@/components/WritePostButton";

export const metadata: Metadata = {
  title: "Tech Lab | In Labs",
  description:
    "Next.js, WebAuthn, Ethers 등 최신 웹 기술 실험을 기록합니다. 실무에 바로 쓰는 팁과 플로우를 정리했어요.",
  alternates: {
    canonical: "/tech-lab",
  },
};

export default function TechLabIndex() {
  const techPosts = [] as any;

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Tech Lab</h1>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-subtle)]">
            프레임워크 업데이트, 인증, 블록체인 등 다양한 기술 실험을 빠르게
            정리하는 공간입니다. 필요한 코드를 바로 가져다 쓸 수 있도록 요약과
            체크리스트를 더했습니다.
          </p>
        </div>
        <WritePostButton labName="Tech Lab" />
      </header>

      <ul className="space-y-5">
        {techPosts.map((post: any) => (
          <li
            key={post.slug}
            className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
          >
            <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden="true">•</span>
              <span>{post.readingTime}</span>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-white">
              <Link
                href={post.href}
                className="transition-colors hover:text-[color:var(--color-accent)]"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
              {post.summary}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
