"use client";

import Image from "next/image";
import type { HTMLAttributes } from "react";

type LoadingSpinnerProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
  label?: string;
};

export default function LoadingSpinner({
  size = 32,
  label = "로딩 중...",
  className = "",
  ...rest
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center gap-2 text-xs text-[color:var(--color-subtle)] ${className}`}
      {...rest}
    >
      <Image
        src="https://in-labs.s3.ap-northeast-2.amazonaws.com/images/loading.gif"
        alt="Loading"
        width={size}
        height={size}
        unoptimized
      />
      <span>{label}</span>
    </div>
  );
}
