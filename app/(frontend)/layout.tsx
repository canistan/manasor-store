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

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith('http')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
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
        url: `${getBaseUrl()}/images/og_image.jpg`,
        width: 1024,
        height: 1024,
        alt: "Manasor Premium Zeytin ve Zeytinyağı",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manasor | Premium Zeytin ve Zeytinyağı",
    description: "Gemlik siyah zeytin ve soğuk sıkım natürel sızma zeytinyağı ile sofralarınıza eşsiz lezzetler katın.",
    images: [`${getBaseUrl()}/images/og_image.jpg`],
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${getBaseUrl()}/#organization`,
        "name": "Manasor",
        "url": getBaseUrl(),
        "logo": {
          "@type": "ImageObject",
          "url": `${getBaseUrl()}/images/og_image.jpg`
        }
      },
      {
        "@type": "WebSite",
        "@id": `${getBaseUrl()}/#website`,
        "url": getBaseUrl(),
        "name": "Manasor",
        "publisher": {
          "@id": `${getBaseUrl()}/#organization`
        }
      }
    ]
  };

  return (
    <html
      lang="tr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased font-light`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
