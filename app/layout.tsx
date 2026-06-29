import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "./lib/config";

const siteUrl = new URL(siteConfig.url);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: siteConfig.openGraph.title,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.openGraph.title,
    url: siteConfig.url,
    siteName: siteConfig.openGraph.title,
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.openGraph.title,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
