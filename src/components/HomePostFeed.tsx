import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { latestPosts } from "@/lib/postData";
import { getPosts } from "@/server/modules/post/post.service";

export default function HomePostFeed() {
  const handleGetPosts = async () => {
    const posts = await getPosts();
  };

  handleGetPosts();

  return (
    <section className="space-y-6">
      <AdSlot
        slotId="YOUR_SLOT_ID_INFEED_1"
        minHeight={300}
        className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />

      {latestPosts.map((post) => (
        <article
          key={post.slug}
          className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
            <span>
              {post.category === "tech"
                ? "Tech Lab"
                : post.category === "food"
                ? "Food Lab"
                : "Bible Lab"}
            </span>
            <span aria-hidden="true">•</span>
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
        </article>
      ))}

      <AdSlot
        slotId="YOUR_SLOT_ID_INFEED_1"
        minHeight={300}
        className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </section>
  );
}
