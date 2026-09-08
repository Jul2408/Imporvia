import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CookieBanner } from "@/components/ui/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    template: "%s | ImporVia",
    default: "ImporVia - Le standard B2B en conformité douanière",
  },
  description: "Plateforme intelligente de simulation, validation et sécurisation des déclarations en douane pour les importateurs et transitaires en zone CEMAC/CEDEAO.",
  keywords: ["dédouanement", "douane", "cemac", "cedeao", "importation", "transitaire", "calcul douanier", "cameroun", "afrique"],
  authors: [{ name: "ImporVia" }],
  creator: "ImporVia",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://imporvia.com",
    title: "ImporVia - Le standard B2B en conformité douanière",
    description: "Plateforme intelligente de simulation, validation et sécurisation des déclarations en douane.",
    siteName: "ImporVia",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImporVia - Le standard B2B en conformité douanière",
    description: "Plateforme intelligente de simulation, validation et sécurisation des déclarations en douane.",
    creator: "@imporvia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        {/* PWA + Mobile */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ImporVia" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/favicon.png" />
      </head>
      <body className={`${inter.variable} min-h-full flex flex-col font-sans`}>
        <AuthProvider>
          {children}
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}

