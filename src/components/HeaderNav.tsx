"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const PRIMARY_LINKS = [
  { href: "/tech-lab", label: "Tech Lab" },
  { href: "/food-lab", label: "Food Lab" },
  { href: "/bible-lab", label: "Bible Lab" },
  { href: "/youtube", label: "YouTube" },
];

const SUPPORT_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function HeaderNav() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement && overlayRef.current?.contains(activeElement)) {
      activeElement.blur();
    }
    menuButtonRef.current?.focus();
    setOpen(false);
  };

  return (
    <header className="border-b border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)]">
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center gap-4 px-4 text-sm text-[color:var(--color-ink)]">
        <Link
          href="/"
          aria-label="In Labs 홈으로 이동"
          className="inline-flex items-center"
        >
          <Image
            src="https://in-labs.s3.ap-northeast-2.amazonaws.com/images/in.png"
            alt="In Labs mark"
            width={40}
            height={40}
            priority
          />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-4 text-xs text-[color:var(--color-subtle)] md:flex">
          {SUPPORT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-3 py-1.5 text-[color:var(--color-ink)]"
          >
            관리자
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] p-2 text-[color:var(--color-ink)] md:hidden"
          aria-label="메뉴 열기"
          onClick={() => setOpen(true)}
          ref={menuButtonRef}
        >
          <span className="sr-only">메뉴 열기</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      <div
        ref={overlayRef}
        className={`fixed inset-0 z-40 transition duration-200 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeMenu}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-72 flex-col border-l border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)] transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[color:var(--color-border-strong)] px-6 py-4">
            <span className="text-sm font-semibold text-white">탐색</span>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] p-2 text-[color:var(--color-ink)]"
              aria-label="메뉴 닫기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-4 px-6 py-6 text-sm">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-4 py-3 text-white"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-[color:var(--color-border-strong)] pt-4 text-xs uppercase tracking-wide text-[color:var(--color-subtle)]">
              Info
            </div>
            {SUPPORT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-3 text-sm text-[color:var(--color-subtle)]"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)] px-4 py-3 text-white"
              onClick={closeMenu}
            >
              관리자
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
}
