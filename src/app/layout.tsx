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
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}"
              crossOrigin="anonymous"
            />
            {/* Better Ads/CLS를 위해 레이아웃에 placeholder를 쓸 예정 */}
          </>
        )}
      </head>
      <body className="min-h-screen bg-[#1E1E1E] text-white">
        <header className="border-b border-white/10 bg-[#1E1E1E]/90 backdrop-blur">
          <nav className="mx-auto max-w-[1200px] px-4 h-14 flex items-center gap-6 text-sm">
            <a
              href="/"
              className="font-semibold text-white hover:text-[#F2D74B]"
            >
              In Labs
            </a>
            <a href="/tech-lab" className="hover:text-[#F2D74B]">
              Tech Lab
            </a>
            <a href="/food-lab" className="hover:text-[#F2D74B]">
              Food Lab
            </a>
            <a href="/bible-lab" className="hover:text-[#F2D74B]">
              Bible Lab
            </a>
            <a href="/youtube" className="hover:text-[#F2D74B]">
              YouTube
            </a>
            <div className="ml-auto flex items-center gap-4 text-xs">
              <a href="/about" className="hover:text-[#F2D74B]">
                About
              </a>
              <a href="/contact" className="hover:text-[#F2D74B]">
                Contact
              </a>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-[1200px] px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-white/10 bg-[#1E1E1E]">
          <div className="mx-auto max-w-[1200px] px-4 py-8 text-sm text-[color:var(--color-subtle)] flex flex-wrap gap-4">
            <span>© {new Date().getFullYear()} In Labs</span>
            <a href="/privacy" className="hover:text-[#F2D74B]">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[#F2D74B]">
              Terms
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
