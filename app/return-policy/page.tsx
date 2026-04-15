import type { Metadata } from "next";
import ReturnPolicyClient from "./ReturnPolicyClient";

const SITE_URL = "https://tabaraktech.com";

export const metadata: Metadata = {
  title: "سياسة الاستبدال والاسترجاع",
  description: "الشروط المنظمة لطلبات الإلغاء والاستبدال والاسترجاع داخل مؤسسة تبارك التقنية الذكية.",
  keywords: ["سياسة الاسترجاع", "استبدال", "إلغاء طلب", "تبارك التقنية", "السعودية"],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/return-policy`,
    title: "سياسة الاستبدال والاسترجاع | مؤسسة تبارك التقنية الذكية",
    description: "الشروط المنظمة لطلبات الإلغاء والاستبدال والاسترجاع داخل مؤسسة تبارك التقنية الذكية.",
    locale: "ar_SA",
    siteName: "مؤسسة تبارك التقنية الذكية",
  },
  alternates: { canonical: `${SITE_URL}/return-policy` },
};

export default function ReturnPolicyPage() {
  return <ReturnPolicyClient />;
}
