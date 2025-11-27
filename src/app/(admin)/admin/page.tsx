"use client";

import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminWeb3AuthPanel from "./AdminWeb3AuthPanel";
import AdminDashboard from "./AdminDashboard";
import DeviceInfoNotice from "@/components/DeviceInfoNotice";
import { useAdminAuth } from "@/providers/AdminAuthProvider";
import { sha256 } from "@/lib/crypto";

export default function AdminHome() {
  const router = useRouter();
  const ADMIN_AUTH_CODE_HASH = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;
  const ADMIN_AUTH_CODE_HASH_MOM =
    process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH_MOM;
  const { isVerified, adminCode, setVerified, reset } = useAdminAuth();

  const isAdminHashMatched = useMemo(() => {
    if (!ADMIN_AUTH_CODE_HASH || !adminCode) {
      return false;
    }
    return sha256(adminCode) === ADMIN_AUTH_CODE_HASH;
  }, [ADMIN_AUTH_CODE_HASH, adminCode]);

  const isMomHashMatched = useMemo(() => {
    if (!ADMIN_AUTH_CODE_HASH_MOM || !adminCode) {
      return false;
    }
    return sha256(adminCode) === ADMIN_AUTH_CODE_HASH_MOM;
  }, [ADMIN_AUTH_CODE_HASH_MOM, adminCode]);

  const handleVerified = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedCode = window.localStorage.getItem("adminAuthCode");
    setVerified(storedCode ?? null);
  }, [setVerified]);

  const handleSignOut = useCallback(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    if (isVerified && isMomHashMatched) {
      router.replace("/adminMom");
    }
  }, [isMomHashMatched, isVerified, router]);

  if (isVerified && isAdminHashMatched) {
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

      <AdminWeb3AuthPanel
        onVerified={handleVerified}
        allowRegistration
        forceVerification
      />

      <DeviceInfoNotice />
    </section>
  );
}
