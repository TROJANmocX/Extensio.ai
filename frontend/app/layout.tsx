import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Extensio.ai — AI-Powered Chrome Extension Generator",
  description: "Create working Google Chrome Extensions (Manifest V3) instantly using plain English prompts. Preview, edit with AI, simulate in real time, and download as ZIP.",
  keywords: ["chrome extension", "extension generator", "ai extension builder", "manifest v3", "copilot", "developer tools", "saas"],
  authors: [{ name: "Extensio.ai Team" }],
  openGraph: {
    title: "Extensio.ai — AI-Powered Chrome Extension Generator",
    description: "Create fully functioning Google Chrome Extensions instantly with natural language prompts.",
    type: "website",
    locale: "en_US",
    siteName: "Extensio.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Extensio.ai — AI-Powered Chrome Extension Generator",
    description: "Create working Manifest V3 Chrome Extensions instantly with AI.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-[#030014] text-gray-100 flex flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
