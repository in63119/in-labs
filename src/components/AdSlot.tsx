"use client";
import { useEffect, type CSSProperties } from "react";

type Props = {
  unitId?: string;
  width?: number;
  height?: number;
  minHeight?: number; // CLS 방지용 placeholder 높이
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_ADFIT_UNIT_ID = "DAN-cGOkyG3oBycBI4m8";
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 250;
const ADFIT_SCRIPT_ID = "kakao-adfit-sdk";
const ADFIT_SCRIPT_SRC = "https://t1.daumcdn.net/kas/static/ba.min.js";

export default function AdSlot({
  unitId,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  minHeight,
  className,
  style,
}: Props) {
  const resolvedUnitId =
    unitId ?? process.env.NEXT_PUBLIC_ADFIT_UNIT_ID ?? DEFAULT_ADFIT_UNIT_ID;
  const resolvedMinHeight = minHeight ?? height;
  const isAdEnabled = Boolean(resolvedUnitId);

  useEffect(() => {
    if (!isAdEnabled) {
      return;
    }

    if (document.getElementById(ADFIT_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement("script");
    script.id = ADFIT_SCRIPT_ID;
    script.src = ADFIT_SCRIPT_SRC;
    script.async = true;
    script.type = "text/javascript";
    script.charset = "utf-8";
    document.body.appendChild(script);
  }, [isAdEnabled]);

  if (!isAdEnabled) {
    return null;
  }

  return (
    <div
      className={className}
      style={{ minHeight: resolvedMinHeight, ...style }}
      aria-label="Advertisements"
    >
      <ins
        className="kakao_ad_area block w-full"
        style={{ display: "block" }}
        data-ad-unit={resolvedUnitId}
        data-ad-width={width}
        data-ad-height={height}
      />
    </div>
  );
}
