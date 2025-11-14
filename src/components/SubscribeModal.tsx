"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { isValidEmail, pinEmail } from "@/lib/emailClient";

export default function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailLocked, setIsEmailLocked] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEmail("");
    setIsEmailLocked(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const emailIsValid = isValidEmail(email);

  const handleAuthorizeEmail = async () => {
    if (emailIsValid) {
      setIsEmailLocked(true);

      await pinEmail(email);
    }
  };

  const showAuthorizeButton = emailIsValid && !isEmailLocked;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="w-full rounded-lg bg-[#F97316] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#fb8a3a]"
      >
        구독하기
      </button>
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-sm rounded-2xl border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] p-6 text-white">
              <h4 className="text-lg font-semibold">구독하기</h4>
              <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
                소식을 받아볼 이메일을 입력하세요.
              </p>
              <p className="mt-2 text-sm text-[color:var(--color-subtle)]">
                입력한 이메일로 4자리 인증 코드를 보내드립니다.
              </p>
              <div className="mt-6 space-y-2">
                <label
                  htmlFor="subscription-email"
                  className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-subtle)]"
                >
                  이메일 주소
                </label>
                <div className="flex gap-3">
                  <input
                    id="subscription-email"
                    type="email"
                    placeholder="your@email.com"
                    className={`flex-1 rounded-lg border border-[color:var(--color-border-strong)] bg-transparent px-3 py-2 text-sm text-white placeholder:text-[color:var(--color-subtle)] focus:outline-none focus:ring-2 focus:ring-white/40 ${
                      isEmailLocked ? "opacity-50" : ""
                    }`}
                    onChange={handleChange}
                    value={email}
                    disabled={isEmailLocked}
                  />
                  {showAuthorizeButton && (
                    <button
                      type="button"
                      onClick={handleAuthorizeEmail}
                      className="whitespace-nowrap rounded-lg border border-transparent bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                    >
                      인증하기
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-[color:var(--color-border-strong)] px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
