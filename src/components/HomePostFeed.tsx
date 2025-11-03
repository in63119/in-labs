import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { getPosts } from "@/server/modules/post/post.service";

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default async function HomePostFeed() {
  const posts = await getPosts();
  const latestPosts = posts.slice(0, 6);

  return (
    <section className="space-y-6">
      <AdSlot
        slotId="YOUR_SLOT_ID_INFEED_1"
        minHeight={300}
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
            className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
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
            <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
              {post.summary}
            </p>
          </article>
        ))
      )}

      <AdSlot
        slotId="YOUR_SLOT_ID_INFEED_1"
        minHeight={300}
        className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </section>
  );
}
