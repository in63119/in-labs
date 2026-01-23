"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAdminAuth } from "@/providers/AdminAuthProvider";
import { getNoIndexPosts } from "@/lib/postClient";
import type { NoIndexPostsResponse, PostSummary } from "@/common/types";

const isNoIndexPostsResponse = (
  value: unknown
): value is NoIndexPostsResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { posts?: unknown }).posts)
  );
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("ko-KR");
};

export default function PostManagementPanel() {
  const { adminCode } = useAdminAuth();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeTab = "noindex";
  const canFetch = Boolean(adminCode);

  useEffect(() => {
    let cancelled = false;

    if (!canFetch) {
      setPosts([]);
      setError("관리자 인증을 먼저 완료해주세요.");
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getNoIndexPosts(adminCode as string);
        if (cancelled) {
          return;
        }

        if (!isNoIndexPostsResponse(response) || !response.ok) {
          const message =
            (response as { message?: string })?.message ??
            "게시글 목록을 불러오지 못했습니다.";
          setError(message);
          setPosts([]);
          return;
        }

        setPosts(response.posts ?? []);
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "게시글 목록을 불러오지 못했습니다.";
          setError(message);
          setPosts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [adminCode, canFetch]);

  const content = useMemo(() => {
    if (!canFetch) {
      return (
        <p className="text-sm text-[var(--color-ink)]">
          관리자 인증 후 게시글 목록을 확인할 수 있습니다.
        </p>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`post-skeleton-${index}`}
              className="h-12 animate-pulse rounded-lg bg-[var(--color-charcoal)]/60"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-sm text-red-400">{error}</p>;
    }

    if (posts.length === 0) {
      return (
        <p className="text-sm text-[var(--color-ink)]">
          현재 noindex 상태의 게시글이 없습니다.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-subtle)]">
          총 {posts.length.toLocaleString()}개
        </p>
        <ul className="space-y-2">
          {posts.map((post) => {
            return (
              <li
                key={post.tokenId}
                className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)]/40 px-4 py-3 text-sm text-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{post.title}</p>
                    <p className="text-xs text-[var(--color-subtle)]">
                      {post.labName} · {formatDate(post.publishedAt)} ·{" "}
                      {post.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-amber-400/60 px-2 py-0.5 text-xs text-amber-200">
                      noindex
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-[var(--color-subtle)]">
                  <Link
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-[var(--color-border-strong)] underline-offset-4"
                  >
                    {post.href}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }, [canFetch, error, isLoading, posts]);

  return (
    <div className="space-y-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">게시글 관리</h2>
          <p className="text-sm text-[var(--color-ink)]">
            구글 애드센스 승인 관리를 위해 noindex 처리된 게시글을 확인합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] px-3 py-1 text-xs text-white">
            {activeTab}
          </span>
        </div>
      </div>
      {content}
    </div>
  );
}
