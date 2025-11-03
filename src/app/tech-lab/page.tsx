import Link from "next/link";
import type { Metadata } from "next";

import WritePostButton from "@/components/WritePostButton";
import { getPostsByCategory } from "@/server/modules/post/post.service";

export const metadata: Metadata = {
  title: "Tech Lab | In Labs",
  description:
    "Next.js, WebAuthn, 블록체인 등 최신 웹 기술 실험을 기록합니다. 실무에 적용하면서 정리한 체크리스트와 트러블슈팅 팁을 확인하세요.",
  alternates: {
    canonical: "/tech-lab",
  },
};

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default async function TechLabIndex() {
  const techPosts = await getPostsByCategory("tech");

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Tech Lab</h1>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-subtle)]">
            Next.js App Router, WebAuthn Passkey, Ethers.js 기반 블록체인 연동 등 최신 웹 기술 실험을
            정리합니다. 실제 프로젝트에서 얻은 팁과 체크리스트를 확인하세요.
          </p>
        </div>
        <WritePostButton labName="Tech Lab" />
      </header>

      <ul className="space-y-5">
        {techPosts.map((post) => (
          <li
            key={post.slug}
            className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span aria-hidden="true">•</span>
                <span>{post.readingTimeLabel}</span>
              </div>
              <WritePostButton
                labName={post.labName}
                mode="edit"
                initialPost={post}
                buttonLabel="수정"
                buttonClassName="rounded-lg border border-[color:var(--color-border-muted)] bg-[color:var(--color-charcoal)] px-3 py-1 text-xs text-[color:var(--color-ink)] hover:border-white/40"
              />
            </div>
            <h2 className="mt-2 text-xl font-semibold text-white">
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
