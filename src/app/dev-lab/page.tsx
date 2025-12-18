import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import WritePostButton from "@/components/WritePostButton";
import DeletePostButton from "@/components/DeletePostButton";
import { getPosts } from "@/lib/postClient";

export const metadata: Metadata = {
  title: "Dev Lab | In Labs",
  description:
    "이 블로그를 만들며 남기는 개발 기록을 모았습니다. 설계 결정, 배포 자동화, 운영 모니터링 실험을 데브 노트로 정리합니다.",
  alternates: {
    canonical: "/dev-lab",
  },
};

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default async function DevLabIndex() {
  const devPosts = (await getPosts()).filter((post) => post.category === "dev");

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Dev Lab</h1>
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-subtle)]">
            이 블로그를 만드는 과정에서 나온 개발 기록을 남깁니다. 페이지 설계
            선택, 배포 자동화, 에러 핸들링, 운영 모니터링 실험을 일지 형식으로
            공유합니다.
          </p>
        </div>
        <WritePostButton labName="Dev Lab" />
      </header>

      <ul className="space-y-5">
        {devPosts.map((post) => (
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
              <div className="flex items-center gap-2">
                <WritePostButton
                  labName={post.labName}
                  mode="edit"
                  initialPost={post}
                  buttonLabel="수정"
                  buttonClassName="rounded-lg border border-[color:var(--color-border-muted)] bg-[color:var(--color-charcoal)] px-3 py-1 text-xs text-[color:var(--color-ink)] hover:border-white/40"
                />
                <DeletePostButton
                  postId={post.tokenId}
                  metadataUrl={post.metadataUrl}
                  labName={post.labName}
                  labSegment={post.labSegment}
                  slug={post.slug}
                  className="rounded-lg border border-[color:var(--color-border-muted)] bg-[color:var(--color-charcoal)] px-3 py-1 text-xs text-[color:var(--color-ink)] hover:border-white/40"
                />
              </div>
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
