import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CategoryBar } from "@/components/CategoryBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ShagarShop — Marketplace",
  description: "Discover and shop quality products from trusted sellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} flex min-h-screen flex-col font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          <Header />
          <CategoryBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
