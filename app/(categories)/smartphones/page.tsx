import type { Metadata } from "next";
import SmartphonesClient from "./SmartphonesClient";

export const dynamic = "force-dynamic";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const SITE_URL = "https://tabaraktech.com";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const siteName = company.nameAr || "مؤسسة تبارك التقنية الذكية";
  const title = `الهواتف الذكية | ${siteName}`;
  const description = `تسوق أحدث الهواتف الذكية بأفضل الأسعار وبالأقساط في ${siteName}. آيفون، سامسونج، شاومي وأكثر.`;
  const logoUrl = company.logo
    ? (company.logo.startsWith("http") ? company.logo : `${BACKEND}${company.logo}`)
    : "";
  return {
    title,
    description,
    keywords: ["هواتف ذكية", "آيفون", "سامسونج", "شاومي", "أقساط", "السعودية", siteName],
    openGraph: {
      type: "website",
      url: `${SITE_URL}/smartphones`,
      title,
      description,
      siteName,
      locale: "ar_SA",
      images: logoUrl ? [{ url: logoUrl, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: logoUrl ? [logoUrl] : [] },
    alternates: { canonical: `${SITE_URL}/smartphones` },
  };
}

export default function SmartphonesPage() {
  return <SmartphonesClient />;
}
