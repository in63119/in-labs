import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdSlot from "@/components/AdSlot";
import WritePostButton from "@/components/WritePostButton";
import DeletePostButton from "@/components/DeletePostButton";
import { markdownRehypePlugins } from "@/lib/markdown";
import type { PostSummary } from "@/common/types";

const BUTTON_CLASS =
  "rounded-full border border-[color:var(--color-border-muted)] bg-[color:var(--color-charcoal)] px-3 py-1 text-xs text-[color:var(--color-ink)] transition hover:border-white/40";

type LabPostPageProps = {
  post: PostSummary;
  relatedPosts: PostSummary[];
};

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function LabPostPage({ post, relatedPosts }: LabPostPageProps) {
  return (
    <article className="mx-auto max-w-[720px] space-y-8 text-white">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
            <span>{post.labName}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden="true">•</span>
            <span>{post.readingTimeLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <WritePostButton
              labName={post.labName}
              mode="edit"
              initialPost={post}
              buttonLabel="수정"
              buttonClassName={BUTTON_CLASS}
            />
            <DeletePostButton
              postId={post.tokenId}
              metadataUrl={post.metadataUrl}
              labName={post.labName}
              labSegment={post.labSegment}
              slug={post.slug}
              className={BUTTON_CLASS}
            />
          </div>
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

      {post.content.trim() ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={markdownRehypePlugins}
          className="prose prose-invert max-w-none leading-7 text-[color:var(--color-subtle)]"
          components={{
            strong: ({ children }) => (
              <strong className="font-semibold text-white">{children}</strong>
            ),
            br: () => <br />,
          }}
        >
          {post.content}
        </ReactMarkdown>
      ) : null}

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
        minHeight={320}
        className="my-6 border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />

      {relatedPosts.length > 0 ? (
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
      ) : null}

      <AdSlot
        minHeight={250}
        className="border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
      />
    </article>
  );
}
