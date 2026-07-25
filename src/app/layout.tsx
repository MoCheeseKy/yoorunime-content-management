import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yooru Instagram Content Ideas",
  description: "Modern dashboard for Instagram content management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} dark h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="h-full font-sans bg-zinc-950 text-white flex overflow-hidden selection:bg-white/30">
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950"></div>
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-950">
          {children}
        </main>
      </body>
    </html>
  );
}
