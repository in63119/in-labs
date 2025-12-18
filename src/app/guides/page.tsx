import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import WritePostButton from "@/components/WritePostButton";
import { getPosts } from "@/lib/postClient";

export const metadata: Metadata = {
  title: "Guides | In Labs",
  description:
    "프로덕트, 운영, 도구 활용 등 여러 주제의 가이드와 체크리스트를 모았습니다. 바로 적용할 수 있도록 단계별로 정리했습니다.",
  alternates: {
    canonical: "/guides",
  },
};

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default async function GuidesIndex() {
  const guidePosts = (await getPosts()).filter(
    (post) => post.category === "guides"
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Guides</h1>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-subtle)]">
            기술·운영·생활 도구까지 범용적으로 쓰일 가이드를 모읍니다. 팁, 절차,
            체크리스트를 바로 따라 할 수 있도록 단계별로 적었습니다.
          </p>
        </div>
        <WritePostButton labName="Guides" />
      </header>

      <ul className="space-y-5">
        {guidePosts.map((post) => (
          <li
            key={post.slug}
            className="group rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
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
              <Link
                href={post.href}
                className="transition-colors hover:text-[color:var(--color-accent)]"
              >
                {post.title}
              </Link>
            </h2>
            {post.image ? (
              <Link href={post.href} className="mt-4 block">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-[color:var(--color-border-muted)] bg-[color:var(--color-charcoal)]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            ) : null}
            <p className="mt-3 text-sm text-[color:var(--color-subtle)]">
              {post.summary}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
