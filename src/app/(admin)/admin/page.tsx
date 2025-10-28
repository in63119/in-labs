"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import AdminWeb3AuthPanel from "./AdminWeb3AuthPanel";
import AdminDashboard from "./AdminDashboard";

export default function AdminHome() {
  const [verified, setVerified] = useState(false);

  const handleVerified = useCallback((_code: string) => {
    setVerified(true);
  }, []);

  const handleSignOut = useCallback(() => {
    setVerified(false);
  }, []);

  if (verified) {
    return <AdminDashboard onSignOut={handleSignOut} />;
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">관리자 센터</h1>
        <p className="text-sm text-[var(--color-subtle)]">
          인증된 사용자만 접근할 수 있습니다.
        </p>
      </header>

      <div className="grid gap-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] p-6">
        <p className="text-sm text-[var(--color-ink)]">
          잠시 길을 잃으신 것 같아요. 아래 버튼으로 홈으로 가세요.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/"
            className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] px-4 py-2 text-[var(--color-ink)] transition-colors hover:border-white/40"
            aria-label="홈으로 이동"
          >
            홈으로 이동
          </Link>
        </div>
      </div>

      <AdminWeb3AuthPanel onVerified={handleVerified} allowRegistration />
    </section>
  );
}
