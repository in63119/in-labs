import Link from "next/link";

import PasskeyManagementPanel from "./PasskeyManagementPanel";
import PostManagementPanel from "./PostManagementPanel";
import SubscriberListPanel from "./SubscriberListPanel";
import VisitorLogsPanel from "./VisitorLogsPanel";

type AdminDashboardProps = {
  onSignOut: () => void;
};

export default function AdminDashboard({ onSignOut }: AdminDashboardProps) {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">관리자 대시보드</h1>
          <p className="text-sm text-[var(--color-subtle)]">
            인증이 완료되었습니다. 필요한 작업을 선택하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-lg border border-[var(--color-border-strong)] px-4 py-2 text-sm text-[var(--color-ink)] transition-colors hover:border-white/40"
        >
          다시 인증하기
        </button>
      </header>

      <div className="grid gap-4">
        <div className="space-y-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">포스트 쓰기</h2>
            <p className="text-sm text-[var(--color-ink)]">
              새 글을 작성하거나 초안을 계속 이어서 작성하세요.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/tech-lab"
              className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] px-4 py-2 text-[var(--color-ink)] transition-colors hover:border-white/40"
            >
              Tech Lab 글 작성
            </Link>
            <Link
              href="/dev-lab"
              className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] px-4 py-2 text-[var(--color-ink)] transition-colors hover:border-white/40"
            >
              Dev Lab 글 작성
            </Link>
            <Link
              href="/guides"
              className="rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-charcoal)] px-4 py-2 text-[var(--color-ink)] transition-colors hover:border-white/40"
            >
              Guides 글 작성
            </Link>
          </div>
        </div>

        <PasskeyManagementPanel />
        <PostManagementPanel />
        <SubscriberListPanel />
        <VisitorLogsPanel />

        <div className="space-y-4 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-charcoal-plus)] p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">관리자 공지</h2>
            <p className="text-sm text-[var(--color-ink)]">
              새 관리자 기능은 곧 추가될 예정입니다. 필요한 기능이 있다면 운영자에게
              알려주세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
