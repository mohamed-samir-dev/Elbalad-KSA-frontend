import { Banner } from "./components/banner";
import { ProductGrid } from "./components/products";
import CustomerReviews from "./components/CustomerReviews";
import ShopByCategory from "./components/ShopByCategory";

export const dynamic = "force-dynamic";
ht
const BACKEND = process.env.BACKEND_URL || "tp://localhost:5000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://albilaad-ksa.com";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export default async function Home() {
  const c = await getCompany();
  const siteName = c.nameAr || "مؤسسة البلاد الحديثة للإلكترونيات";
  const logoUrl = c.logo
    ? (c.logo.startsWith("http") ? c.logo : `${BACKEND}${c.logo}`)
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: c.nameEn || "Al Bilad Modern Electronics",
    url: SITE_URL,
    logo: logoUrl,
    contactPoint: [
      c.phone && {
        "@type": "ContactPoint",
        telephone: c.phone,
        contactType: "customer service",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
      c.whatsapp && {
        "@type": "ContactPoint",
        telephone: c.whatsapp,
        contactType: "sales",
        areaServed: "SA",
        availableLanguage: "Arabic",
      },
    ].filter(Boolean),
    address: c.addressAr ? {
      "@type": "PostalAddress",
      addressLocality: c.addressAr,
      addressCountry: "SA",
    } : undefined,
    email: c.email || undefined,
    sameAs: c.website ? [c.website] : [],
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <main className="min-h-screen" style={{ background: 'linear-gradient(180deg, #d4ece8 0%, #e2f3f0 20%, #edf7f5 45%, #f5fbf9 70%, #ffffff 100%)' }}>
        <Banner />
        <ShopByCategory />
        <ProductGrid />
        <CustomerReviews />
      </main>
    </>
  );
}
