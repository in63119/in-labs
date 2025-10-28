"use client";

import AdminWeb3AuthPanel from "@/app/(admin)/admin/AdminWeb3AuthPanel";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  onVerified: (code: string) => void | Promise<void>;
  isProcessing?: boolean;
  errorMessage?: string | null;
  defaultCode?: string | null;
};

export default function AuthModal({
  open,
  onClose,
  onVerified,
  isProcessing = false,
  errorMessage,
  defaultCode = null,
}: AuthModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-heading"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[color:var(--color-border-strong)] px-6 py-4">
          <div>
            <h2
              id="auth-modal-heading"
              className="text-lg font-semibold text-white"
            >
              관리자 인증
            </h2>
            <p className="text-xs text-[color:var(--color-subtle)]">
              게시하려면 관리자 생체 인증을 완료하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[color:var(--color-border-strong)] px-3 py-1 text-sm text-[color:var(--color-subtle)] transition hover:border-white/40 hover:text-white"
            aria-label="인증 모달 닫기"
            disabled={isProcessing}
          >
            닫기
          </button>
        </header>

        <div className="space-y-4 px-6 py-6">
          <AdminWeb3AuthPanel
            onVerified={onVerified}
            defaultCode={defaultCode ?? undefined}
          />
          {isProcessing ? (
            <p className="text-xs text-[color:var(--color-subtle)]">
              게시 중입니다… 잠시만 기다려주세요.
            </p>
          ) : null}
          {errorMessage ? (
            <p className="text-xs text-red-400">{errorMessage}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
