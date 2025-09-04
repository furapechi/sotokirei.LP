import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "外構・造園サービス｜即時概算見積",
  description: "草刈・草むしり・伐採・剪定のスピード見積と安心価格",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-white to-slate-50 text-slate-900`}
      >
        <header className="sticky top-0 z-30 w-full border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <div className="font-bold">Sotokirei</div>
            <nav className="flex items-center gap-5 text-sm font-semibold">
              <a href="/works" className="hover:underline">実績</a>
              <a href="#contact" className="hover:underline">お問い合わせ</a>
              <a href="#quote" className="inline-block">今すぐ見積</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4">
          {children}
        </main>
        <footer className="mt-20 py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} Sotokirei</footer>
      </body>
    </html>
  );
}
