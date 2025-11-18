"use client";
import { useEffect } from "react";

type Props = {
  slotId: string; // 고유 ID
  format?: "auto" | "fluid" | "rectangle";
  minHeight?: number; // CLS 방지용 placeholder 높이
  className?: string;
  style?: React.CSSProperties;
};

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({
  slotId,
  format = "auto",
  minHeight = 300,
  className,
  style,
}: Props) {
  const isAdEnabled =
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!isAdEnabled) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [isAdEnabled]);
  const dataAttrs =
    format === "fluid"
      ? { "data-ad-format": "fluid", "data-ad-layout-key": "-gw-3+1f-3d+2z" }
      : { "data-ad-format": "auto" };

  if (!isAdEnabled) {
    return null;
  }

  return (
    <div
      className={className}
      style={{ minHeight, ...style }}
      aria-label="Advertisements"
    >
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slotId}
        {...dataAttrs}
      />
    </div>
  );
}
