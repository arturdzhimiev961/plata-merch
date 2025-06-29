import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Product Catalog | Shop Our Collection",
  description: "Browse our collection of high-quality products. View product details, place orders, and download product information.",
  keywords: ["products", "catalog", "shop", "order", "download", "pdf"],
  authors: [{ name: "Next.js Developer" }],
  creator: "Next.js Developer",
  publisher: "Next.js Developer",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    title: "Product Catalog | Shop Our Collection",
    description: "Browse our collection of high-quality products. View product details, place orders, and download product information.",
    siteName: "Product Catalog",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Product Catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Catalog | Shop Our Collection",
    description: "Browse our collection of high-quality products. View product details, place orders, and download product information.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
