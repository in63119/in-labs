import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AdSlot from "@/components/AdSlot";
import {
  getPostBySlug,
  getPostsByCategory,
} from "@/server/modules/post/post.service";

type RouteParams = {
  slug: string;
};

export async function generateStaticParams() {
  const posts = await getPostsByCategory("tech");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.category !== "tech") {
    return {};
  }

  return {
    title: `${post.title} | Tech Lab`,
    description: post.summary,
    alternates: {
      canonical: post.href,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: post.href,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: post.image ? [post.image] : undefined,
    },
  };
}

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const renderContent = (content: string) => {
  if (!content.trim()) {
    return null;
  }

  return content.split(/\n{2,}/).map((paragraph, index) => (
    <p key={index} className="leading-7 text-[color:var(--color-subtle)]">
      {paragraph.trim()}
    </p>
  ));
};

export default async function TechPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.category !== "tech") {
    notFound();
  }

  const relatedPosts = (await getPostsByCategory("tech"))
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-[720px] space-y-8 text-white">
      <header className="space-y-3">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
          <span>{post.labName}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span aria-hidden="true">•</span>
          <span>{post.readingTimeLabel}</span>
        </div>
        <h1 className="text-3xl font-bold text-white">{post.title}</h1>
        <p className="text-sm leading-6 text-[color:var(--color-subtle)]">
          {post.summary}
        </p>
        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 text-xs text-[color:var(--color-subtle)]">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[color:var(--color-border-strong)] px-2 py-0.5"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div className="space-y-5">{renderContent(post.content)}</div>

      {post.relatedLinks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">참고 링크</h2>
          <ul className="list-inside list-disc text-sm text-[color:var(--color-subtle)]">
            {post.relatedLinks.map((link) => (
              <li key={link}>
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-[color:var(--color-accent)]"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <AdSlot
        slotId="YOUR_SLOT_ID_INARTICLE_1"
        minHeight={320}
        className="my-6 border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />

      <section className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5">
        <h2 className="text-lg font-semibold text-white">다음으로 읽어볼 글</h2>
        <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-subtle)]">
          {relatedPosts.map((related) => (
            <li key={related.slug}>
              <Link
                href={related.href}
                className="transition-colors hover:text-[color:var(--color-accent)]"
              >
                {related.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot
        slotId="YOUR_SLOT_ID_BOTTOM"
        minHeight={250}
        className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </article>
  );
}
