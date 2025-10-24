"use client";

import { useEffect, useState } from "react";
import { sha256 } from "@/lib/crypto";
import { authentication, registration } from "@/lib/authClient";

export default function AdminWeb3AuthPanel() {
  const [code, setCode] = useState<string>("");
  const [address, setAddress] = useState("");

  const ADMIN_AUTH_CODE_HASH = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;

  useEffect(() => {
    if (ADMIN_AUTH_CODE_HASH === sha256(code)) {
      const auth = async () => {
        // 인증
        const option = await authentication({ email: code });

        // 인증 실패 시 등록
        if (option.error && option.message === "사용자를 찾을 수 없습니다.") {
          const regOption = await registration({
            email: code,
            allowMultipleDevices: false,
          });

          console.log("regOption", regOption);
        }
      };

      auth();
    }
  }, [code]);

  return (
    <div className="space-y-4 rounded-xl border border-[color:var(--color-border-strong)] p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Auth</h2>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <input
          value={code}
          placeholder="관리자 코드를 입력하세요."
          onChange={(e) => setCode(e.target.value)}
          className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] px-4 py-2 text-foreground outline-none"
        />
      </label>
    </div>
  );
}
