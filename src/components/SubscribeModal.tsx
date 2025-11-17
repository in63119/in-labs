"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { isValidEmail, pinEmail, verifyPinCode } from "@/lib/emailClient";
import LoadingSpinner from "./LoadingSpinner";
import { subscribe } from "@/lib/subscribeClient";

const PIN_SUCCESS_MESSAGE = "인증이 완료되었습니다.";

export default function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailLocked, setIsEmailLocked] = useState(false);
  const [showPinInputs, setShowPinInputs] = useState(false);
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSendingPin, setIsSendingPin] = useState(false);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [pinVerifyMessage, setPinVerifyMessage] = useState<string | null>(null);
  const pinInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEmail("");
    setIsEmailLocked(false);
    setShowPinInputs(false);
    setPinDigits(["", "", "", ""]);
    setTimeLeft(0);
    setIsSendingPin(false);
    setIsVerifyingPin(false);
    setIsPinVerified(false);
    setIsSubscribing(false);
    setPinVerifyMessage(null);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const emailIsValid = isValidEmail(email);

  const handleAuthorizeEmail = async () => {
    if (emailIsValid) {
      setIsEmailLocked(true);
      setShowPinInputs(true);
      setPinDigits(["", "", "", ""]);
      setTimeLeft(600);

      const pinResponse = await pinEmail(email);
      if (!pinResponse || "message" in pinResponse) {
        setIsEmailLocked(false);
        setShowPinInputs(false);
        setTimeLeft(0);
        setPinVerifyMessage(
          pinResponse && "message" in pinResponse
            ? pinResponse.message
            : "이메일 인증 중 오류가 발생했습니다."
        );
        return;
      }

      setPinVerifyMessage(null);
      setIsPinVerified(false);
    }
  };

  const showAuthorizeButton = emailIsValid && !isEmailLocked;
  const formattedTimeLeft = `${Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    if (!showPinInputs || isPinVerified) return;
    if (pinDigits.some((digit) => digit === "")) return;

    let cancelled = false;

    const verify = async () => {
      setIsVerifyingPin(true);
      setPinVerifyMessage(null);
      const pinCode = pinDigits.join("");
      const response = await verifyPinCode(pinCode);
      if (cancelled) return;
      setIsVerifyingPin(false);

      if (response && !("message" in response) && response.verified) {
        setIsPinVerified(true);
        setPinVerifyMessage(PIN_SUCCESS_MESSAGE);
        setTimeLeft(0);
      } else {
        setPinVerifyMessage(
          response && "message" in response
            ? response.message
            : "인증 코드가 일치하지 않습니다. 다시 입력해주세요."
        );
        setPinDigits(["", "", "", ""]);
        pinInputRefs.current[0]?.focus();
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [pinDigits, showPinInputs, isPinVerified]);

  const handlePinDigitChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const digit = event.target.value.replace(/\D/g, "").slice(-1);
      setPinDigits((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });

      if (digit && index < pinInputRefs.current.length - 1) {
        pinInputRefs.current[index + 1]?.focus();
      }
    };

  const handlePinKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !pinDigits[index] && index > 0) {
        pinInputRefs.current[index - 1]?.focus();
      }
    };

  const handleSubscribe = async () => {
    if (!isPinVerified || isSubscribing) return;
    setIsSubscribing(true);

    try {
      const response = await subscribe(email);
      if (response && !("message" in response) && response.subscribed) {
        // Subscription successful
        closeModal();
      } else {
        setPinVerifyMessage(
          response && "message" in response
            ? response.message
            : "구독 중 오류가 발생했습니다."
        );
      }
    } catch (error) {
      setPinVerifyMessage(
        error instanceof Error ? error.message : "구독 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubscribing(false);
    }
  };

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
                {isSendingPin && (
                  <LoadingSpinner
                    className="justify-end"
                    label="인증 메일을 보내는 중..."
                    size={24}
                  />
                )}
                {timeLeft > 0 && (
                  <div className="flex justify-end text-xs text-[color:var(--color-subtle)]">
                    {formattedTimeLeft}
                  </div>
                )}
                {isPinVerified && (
                  <p
                    className={`text-xs font-semibold ${
                      pinVerifyMessage &&
                      pinVerifyMessage !== PIN_SUCCESS_MESSAGE
                        ? "text-[color:var(--color-warning)]"
                        : "text-emerald-400"
                    }`}
                  >
                    {pinVerifyMessage ?? PIN_SUCCESS_MESSAGE}
                  </p>
                )}
              </div>
              {showPinInputs && !isPinVerified && (
                <div className="mt-6 space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-subtle)]">
                    인증 코드
                  </label>
                  <div className="flex items-center justify-between gap-2">
                    {pinDigits.map((digit, index) => (
                      <input
                        key={`pin-${index}`}
                        ref={(el) => {
                          pinInputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={handlePinDigitChange(index)}
                        onKeyDown={handlePinKeyDown(index)}
                        disabled={isPinVerified}
                        className={`h-12 w-12 rounded-lg border border-[color:var(--color-border-strong)] bg-transparent text-center text-lg font-semibold tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-white/40 ${
                          isPinVerified ? "opacity-70" : ""
                        }`}
                      />
                    ))}
                  </div>
                  {isVerifyingPin && (
                    <LoadingSpinner
                      className="justify-start"
                      label="인증 코드를 확인하는 중..."
                      size={20}
                    />
                  )}
                  {pinVerifyMessage && (
                    <p
                      className={`text-xs ${
                        isPinVerified
                          ? "text-emerald-400"
                          : "text-[color:var(--color-warning)]"
                      }`}
                    >
                      {pinVerifyMessage}
                    </p>
                  )}
                  {!isVerifyingPin && (
                    <p className="text-xs text-[color:var(--color-subtle)]">
                      이메일로 받은 4자리 코드를 입력하세요.
                    </p>
                  )}
                </div>
              )}
              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex-1 min-h-[24px]">
                  {isSubscribing && (
                    <LoadingSpinner
                      className="justify-start"
                      label="구독하는 중입니다"
                      size={20}
                    />
                  )}
                </div>
                <div className="flex gap-3">
                  {isPinVerified && (
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      className={`rounded-lg bg-[#F97316] px-4 py-2 text-xs font-semibold text-white transition ${
                        isSubscribing ? "opacity-60" : "hover:bg-[#fb8a3a]"
                      }`}
                    >
                      구독
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-[color:var(--color-border-strong)] px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
