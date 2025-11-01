"use client";

import { useDeviceInfo } from "@/providers/DeviceInfoProvider";

export default function DeviceInfoNotice() {
  const { info } = useDeviceInfo();

  if (!info) {
    return null;
  }

  return (
    <p className="rounded-xl border border-dashed border-[color:var(--color-border-subtle)] bg-[color:var(--color-charcoal)] px-6 py-3 text-xs text-[color:var(--color-subtle)]">
      Detected device: {info.deviceType} · OS: {info.os}
    </p>
  );
}
