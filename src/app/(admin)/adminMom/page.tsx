"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardMom from "./AdminDashboardMom";
import { useAdminAuth } from "@/providers/AdminAuthProvider";
import { sha256 } from "@/lib/crypto";

export default function AdminMomHome() {
  const router = useRouter();
  const { isVerified, adminCode, reset } = useAdminAuth();
  const momHash = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH_MOM;

  const isMomVerified = useMemo(() => {
    if (!momHash || !adminCode) {
      return false;
    }
    return sha256(adminCode) === momHash;
  }, [adminCode, momHash]);

  useEffect(() => {
    if (!momHash) {
      router.replace("/admin");
      return;
    }

    if (!isVerified || !isMomVerified) {
      router.replace("/admin");
    }
  }, [isMomVerified, isVerified, momHash, router]);

  const handleSignOut = useCallback(() => {
    reset();
    router.replace("/admin");
  }, [reset, router]);

  if (isVerified && isMomVerified) {
    return <AdminDashboardMom onSignOut={handleSignOut} />;
  }

  return null;
}
