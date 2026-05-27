import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
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
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} antialiased min-h-full bg-black text-[#f5f5f5] flex flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
