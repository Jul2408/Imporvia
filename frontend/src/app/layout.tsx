import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

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
    <html lang="fr" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
