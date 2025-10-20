import Link from "next/link";
import type { Metadata } from "next";

import { foodPosts } from "@/lib/postData";

export const metadata: Metadata = {
  title: "Food Lab | In Labs",
  description:
    "계절 과일차부터 냉장 디저트까지, 실험해본 레시피와 준비 팁을 기록합니다. 집에서도 쉽게 따라 해보세요.",
  alternates: {
    canonical: "/food-lab",
  },
};

export default function FoodLab() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Food Lab</h1>
        <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-subtle)]">
          제철 재료로 만들 수 있는 간단한 한 끼와 디저트를 기록합니다. 어떤 재료를 어떻게 손질하고
          보관하면 좋은지 팁도 함께 정리했습니다.
        </p>
      </header>

      <ul className="space-y-5">
        {foodPosts.map((post) => (
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
