"use client";

import { useEffect, useState } from "react";
import { sha256 } from "@/lib/crypto";

export default function AdminWeb3AuthPanel() {
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");

  const ADMIN_AUTH_CODE_HASH = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;

  useEffect(() => {
    if (ADMIN_AUTH_CODE_HASH === sha256(code)) {
      console.log("입력한 코드의 해시:", sha256(code));
      console.log("환경변수에 설정된 해시:", ADMIN_AUTH_CODE_HASH);
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
