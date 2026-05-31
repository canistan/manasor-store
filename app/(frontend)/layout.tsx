import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CookieConsent from "@/components/CookieConsent";
import CartToast from "@/components/CartToast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://manasor.com'),
  title: {
    default: "Manasor | Premium Zeytin ve Zeytinyağı",
    template: "%s | Manasor"
  },
  description: "Gemlik siyah zeytin ve soğuk sıkım natürel sızma zeytinyağı ile sofralarınıza eşsiz lezzetler katın. %100 doğal ve organik.",
  keywords: ["zeytin", "zeytinyağı", "gemlik zeytini", "soğuk sıkım zeytinyağı", "natürel sızma", "manasor", "organik zeytin", "sağlıklı beslenme"],
  authors: [{ name: "Manasor" }],
  creator: "Manasor",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Manasor",
    title: "Manasor | Premium Zeytin ve Zeytinyağı",
    description: "Gemlik siyah zeytin ve soğuk sıkım natürel sızma zeytinyağı ile sofralarınıza eşsiz lezzetler katın. %100 doğal ve organik.",
    images: [
      {
        url: "/images/hero_banner_1779729149147.png",
        width: 1200,
        height: 630,
        alt: "Manasor Premium Zeytin ve Zeytinyağı",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manasor | Premium Zeytin ve Zeytinyağı",
    description: "Gemlik siyah zeytin ve soğuk sıkım natürel sızma zeytinyağı ile sofralarınıza eşsiz lezzetler katın.",
    images: ["/images/hero_banner_1779729149147.png"],
  },
  robots: {
    index: false,
    follow: false,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased font-light`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <CartToast />
        <CookieConsent />
      </body>
    </html>
  );
}
