import Link from "next/link";
import HeaderNav from "@/components/HeaderNav";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { DeviceInfoProvider } from "@/providers/DeviceInfoProvider";
import { AdminAuthProvider } from "@/providers/AdminAuthProvider";
import { configReady } from "@/server/bootstrap/init";

import "./globals.css";

const isProd = process.env.NODE_ENV === "production";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // ca-pub-XXXX

export const metadata = {
  title: "In Labs",
  description: "Tech · Food · Bible · YouTube",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await configReady;

  return (
    <html lang="ko">
      <head>
        {isProd && ADSENSE_CLIENT ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <ReactQueryProvider>
          <AdminAuthProvider>
            <DeviceInfoProvider>
              <HeaderNav />
              <main className="mx-auto mt-10 max-w-[1200px] space-y-10 px-6 pb-16">
                {children}
              </main>
              <footer className="mt-16 border-t border-(--color-border-strong) bg-background">
                <div className="mx-auto max-w-[1200px] px-4 py-8 text-sm text-(--color-subtle) flex flex-wrap gap-4">
                  <span>© {new Date().getFullYear()} In Labs</span>
                  <Link href="/privacy">Privacy</Link>
                  <Link href="/terms">Terms</Link>
                </div>
              </footer>
            </DeviceInfoProvider>
          </AdminAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
