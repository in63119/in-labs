"use client";

import { useEffect, useState } from "react";
import { sha256 } from "@/lib/crypto";
import { authentication, registration } from "@/lib/authClient";

type AdminWeb3AuthPanelProps = {
  onVerified?: () => void;
};

type AuthResult = {
  ok?: boolean;
  verified?: boolean;
  error?: boolean;
  message?: string;
};

export default function AdminWeb3AuthPanel({
  onVerified,
}: AdminWeb3AuthPanelProps) {
  const [code, setCode] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  const ADMIN_AUTH_CODE_HASH = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;

  useEffect(() => {
    if (!ADMIN_AUTH_CODE_HASH) {
      setStatusMessage(null);
      setIsProcessing(false);
      setErrorMessage("관리자 인증 코드가 설정되지 않았습니다.");
      return;
    }

    if (hasVerified) {
      return;
    }

    if (!code) {
      setStatusMessage(null);
      setErrorMessage(null);
      setIsProcessing(false);
      return;
    }

    if (sha256(code) !== ADMIN_AUTH_CODE_HASH) {
      setStatusMessage(null);
      setErrorMessage(null);
      setIsProcessing(false);
      return;
    }

    let cancelled = false;

    const authenticate = async () => {
      setIsProcessing(true);
      setStatusMessage("관리자 인증을 진행 중입니다…");
      setErrorMessage(null);

      const resAuth = (await authentication({ email: code })) as AuthResult;

      if (cancelled) {
        return;
      }

      if (resAuth?.verified) {
        setHasVerified(true);
        setStatusMessage("관리자 인증이 완료되었습니다.");
        setIsProcessing(false);
        onVerified?.();
        return;
      }

      if (resAuth?.error && resAuth.message === "사용자를 찾을 수 없습니다.") {
        setStatusMessage("등록되지 않은 관리자입니다. 등록 절차를 진행합니다…");

        const registerResult = (await registration({
          email: code,
          allowMultipleDevices: false,
        })) as AuthResult;

        if (cancelled) {
          return;
        }

        if (registerResult?.verified) {
          setHasVerified(true);
          setStatusMessage("관리자 등록이 완료되었습니다.");
          setIsProcessing(false);
          onVerified?.();
          return;
        }

        setErrorMessage(
          registerResult?.message ?? "관리자 등록에 실패했습니다."
        );
        setStatusMessage(null);
        setIsProcessing(false);
        return;
      }

      if (resAuth?.error) {
        setErrorMessage(resAuth.message ?? "인증에 실패했습니다.");
      } else {
        setErrorMessage("인증에 실패했습니다.");
      }

      setStatusMessage(null);
      setIsProcessing(false);
    };

    void authenticate();

    return () => {
      cancelled = true;
    };
  }, [ADMIN_AUTH_CODE_HASH, code, hasVerified, onVerified, retryNonce]);

  const handleRetry = () => {
    if (isProcessing || hasVerified) {
      return;
    }

    if (!code || sha256(code) !== ADMIN_AUTH_CODE_HASH) {
      setErrorMessage("올바른 관리자 코드를 먼저 입력하세요.");
      return;
    }

    setStatusMessage(null);
    setErrorMessage(null);
    setRetryNonce((nonce) => nonce + 1);
  };

  if (hasVerified && !onVerified) {
    return (
      <div className="space-y-4 rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">관리자 인증 완료</h2>
          <p className="text-sm text-[color:var(--color-subtle)]">
            인증이 완료되었습니다. 이제 관리자 기능을 사용할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Admin Auth</h2>
        <p className="text-sm text-[color:var(--color-subtle)]">
          관리자 전용 코드로 생체 인증을 진행합니다.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-xs text-[color:var(--color-subtle)]">
          인증 코드
        </span>
        <input
          value={code}
          placeholder="관리자 코드를 입력하세요."
          onChange={(e) => setCode(e.target.value)}
          disabled={isProcessing}
          className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-4 py-2 text-foreground outline-none transition disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="관리자 코드 입력"
          aria-busy={isProcessing}
        />
      </label>

      {statusMessage && (
        <p className="text-xs text-[color:var(--color-subtle)]">
          {statusMessage}
        </p>
      )}
      {errorMessage && (
        <p className="text-xs text-red-400">{errorMessage}</p>
      )}
      {!hasVerified && (
        <button
          type="button"
          onClick={handleRetry}
          disabled={
            isProcessing ||
            !code ||
            sha256(code) !== ADMIN_AUTH_CODE_HASH
          }
          className="w-full rounded-lg border border-[color:var(--color-border-strong)] px-4 py-2 text-xs font-semibold text-[color:var(--color-subtle)] transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessing ? "인증 진행 중..." : "인증 다시 시도"}
        </button>
      )}
    </div>
  );
}
