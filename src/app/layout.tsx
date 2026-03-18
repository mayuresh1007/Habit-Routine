import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "TinyWin | The Ultimate Habit Tracker & Routine Planner",
    template: "%s | TinyWin",
  },
  description: "Transform your daily life with TinyWin. Build powerful habits, organize morning to evening routines, track consistency streaks, and print physical dashboards. Your personal command center for winning the day.",
  keywords: ["habit tracker", "routine planner", "daily checklist", "streak tracking", "productivity app", "printable dashboard", "ADHD planner", "TinyWin", "goal setting", "self improvement"],
  applicationName: "TinyWin",
  authors: [{ name: "TinyWin Team" }],
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logoverticle.png", type: "image/png" }
    ],
    apple: [
      { url: "/logoverticle.png", type: "image/png" }
    ]
  },
  openGraph: {
    title: "TinyWin | Habit Tracker & Routine Planner",
    description: "Build habits that stick, organize daily tasks, and win your day. The ultimate dashboard for your routine.",
    type: "website",
    url: "https://tinywin.vercel.app/",
    siteName: "TinyWin",
    images: [
      {
        url: "/logohorizontal.png",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyWin | Habit Tracker & Routine Planner",
    description: "Build habits that stick and organize your daily routines in one beautiful dashboard.",
    images: ["/logohorizontal.png"],
  },
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
