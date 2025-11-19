"use client";

import Skeleton from "@mui/material/Skeleton";

const PLACEHOLDER_COUNT = 3;

export default function HomePostFeedSkeleton() {
  return (
    <section className="space-y-6">
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
        <article
          key={index}
          className="rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-6 py-5"
        >
          <div className="flex items-center gap-3">
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="text" width={110} height={16} />
            <Skeleton variant="text" width={90} height={16} />
          </div>
          <Skeleton
            variant="text"
            width="70%"
            height={32}
            className="mt-3"
          />
          <Skeleton
            variant="rectangular"
            height={180}
            className="mt-4 rounded-lg"
          />
          <div className="mt-4 space-y-2">
            <Skeleton variant="text" height={18} />
            <Skeleton variant="text" width="90%" height={18} />
          </div>
        </article>
      ))}
    </section>
  );
}
