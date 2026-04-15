import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import Footer from "./components/Footer";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const SITE_URL = "https://tabarak-tech.com";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, { next: { revalidate: 3600, tags: ["company"] } });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const c = await getCompany();

  const siteName = c.nameAr || "مؤسسة تبارك التقنية الذكية";
  const description = c.details || "مؤسسة تبارك التقنية الذكية - أجهزة إلكترونية بالأقساط داخل المملكة العربية السعودية. أفضل الأسعار على الجوالات، اللابتوبات، الأجهزة اللوحية والإكسسوارات.";

  const logoUrl = c.logo
    ? (c.logo.startsWith("http") ? c.logo : `${SITE_URL}/api/tabarak${c.logo}`)
    : `${SITE_URL}/android-chrome-512x512.png`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: [
      siteName,
      c.nameEn || "Tabarak Tech",
      "تبارك", "تبارك التقنية", "أقساط", "جوالات", "لابتوب", "أجهزة إلكترونية",
      "سامسونج", "آبل", "أيفون", "شاومي",
      "السعودية", "الرياض", "جدة",
    ],
    authors: [{ name: siteName, url: SITE_URL }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.ico" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      other: [
        { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
        { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
      ],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url: SITE_URL,
      siteName,
      title: siteName,
      description,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: siteName,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [{ url: logoUrl, alt: siteName }],
    },
    alternates: {
      canonical: SITE_URL,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || "",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased" suppressHydrationWarning>
        <ClientLayout footer={<Footer />}>{children}</ClientLayout>
      </body>
    </html>
  );
}
