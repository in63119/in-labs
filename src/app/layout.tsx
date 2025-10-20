import Link from "next/link";

import "./globals.css";

const isProd = process.env.NODE_ENV === "production";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // ca-pub-XXXX

export const metadata = {
  title: "In Labs",
  description: "Tech · Food · Bible · YouTube",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {isProd && ADSENSE_CLIENT && (
          <>
            {/* AdSense loader */}
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
            />
            {/* Better Ads/CLS를 위해 레이아웃에 placeholder를 쓸 예정 */}
          </>
        )}
      </head>
      <body className="min-h-screen bg-[color:var(--color-charcoal)] text-[color:var(--color-ink)]">
        <header className="border-b border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal-plus)]">
          <nav className="mx-auto max-w-[1200px] px-4 h-14 flex items-center gap-6 text-sm text-[color:var(--color-ink)]">
            <Link
              href="/"
              className="font-semibold text-[color:var(--color-ink)] transition-colors"
            >
              In Labs
            </Link>
            <Link href="/tech-lab" className="transition-colors">
              Tech Lab
            </Link>
            <Link href="/food-lab" className="transition-colors">
              Food Lab
            </Link>
            <Link href="/bible-lab" className="transition-colors">
              Bible Lab
            </Link>
            <Link href="/youtube" className="transition-colors">
              YouTube
            </Link>
            <div className="ml-auto flex items-center gap-4 text-xs text-[color:var(--color-subtle)]">
              <Link href="/about" className="transition-colors">
                About
              </Link>
              <Link href="/contact" className="transition-colors">
                Contact
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto mt-10 max-w-[1200px] space-y-10 px-6 pb-16">
          {children}
        </main>
        <footer className="mt-16 border-t border-[color:var(--color-border-strong)] bg-[color:var(--color-charcoal)]">
          <div className="mx-auto max-w-[1200px] px-4 py-8 text-sm text-[color:var(--color-subtle)] flex flex-wrap gap-4">
            <span>© {new Date().getFullYear()} In Labs</span>
            <Link href="/privacy">
              Privacy
            </Link>
            <Link href="/terms">
              Terms
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
