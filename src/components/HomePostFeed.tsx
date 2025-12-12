import Link from "next/link";
import Image from "next/image";
import AdSlot from "@/components/AdSlot";
import { getPosts } from "@/lib/postClient";
import { isLabCategoryVisible } from "@/common/utils/labVisibility";
import getConfig from "@/common/config/default.config";
import { configReady } from "@/server/bootstrap/init";

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default async function HomePostFeed() {
  await configReady;
  const kakaoAd = getConfig();
  const kakaoTopAdUnit = kakaoAd.kakaoAd?.top?.unit || "DAN-cGOkyG3oBycBI4m8";
  const kakaoBottomAdUnit =
    kakaoAd.kakaoAd?.bottom?.unit || "DAN-24nYOm9lPUw8Cel0";

  const posts = await getPosts();
  const visiblePosts = posts.filter((post) =>
    isLabCategoryVisible(post.category)
  );
  const latestPosts = visiblePosts.slice(0, 6);

  return (
    <section className="space-y-6">
      <AdSlot
        unitId={kakaoTopAdUnit}
        className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />

      {latestPosts.length === 0 ? (
        <p className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5 text-sm text-[color:var(--color-subtle)]">
          아직 게시된 글이 없습니다. 새로운 실험을 기록해 보세요.
        </p>
      ) : (
        latestPosts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
          >
            <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
              <span>{post.labName}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              <span aria-hidden="true">•</span>
              <span>{post.readingTimeLabel}</span>
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
                    sizes="(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            ) : null}
            <p className="mt-3 text-sm text-[color:var(--color-subtle)]">
              {post.summary}
            </p>
          </article>
        ))
      )}

      <AdSlot
        unitId={kakaoBottomAdUnit}
        className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </section>
  );
}
