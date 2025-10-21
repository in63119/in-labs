import Link from "next/link";
import { sha256 } from "@/lib/crypto";
import AdminWeb3AuthPanel from "./AdminWeb3AuthPanel";

export default function AdminHome() {
  const code = sha256("m71050945");
  // const deCode = decrypt(
  //   "U2FsdGVkX1/IIHUkowx/8TtbrNxrEDkb9bQSlm1R23AD3dVNVVLsHXuZGuDF2YiBoxQ/J5GQp7cgg87o6q9SQ7MzX57oxzPlv2zH5VSByYsdo4kJvjadftTOtwUZOjDJ",
  //   "in63119"
  // );

  // U2FsdGVkX1/IIHUkowx/8TtbrNxrEDkb9bQSlm1R23AD3dVNVVLsHXuZGuDF2YiBoxQ/J5GQp7cgg87o6q9SQ7MzX57oxzPlv2zH5VSByYsdo4kJvjadftTOtwUZOjDJ

  console.log(code);
  // console.log(deCode);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">관리자 센터</h1>
        <p className="text-sm text-[color:var(--color-subtle)]">
          블록체인 프라이빗 키로 인증된 사용자만 접근할 수 있습니다.
        </p>
      </header>

      <div className="grid gap-4 rounded-xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] p-6">
        <p className="text-sm text-[color:var(--color-ink)]">
          필요한 관리 기능을 이 영역에 추가하세요. 정적 페이지이지만 Next.js
          Middleware를 통해 기본 인증이 적용되어 있습니다.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/"
            className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-4 py-2 text-[color:var(--color-ink)] transition-colors hover:border-white/40"
          >
            홈으로 이동
          </Link>
        </div>
      </div>

      <AdminWeb3AuthPanel />
    </section>
  );
}
