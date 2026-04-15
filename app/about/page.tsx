import type { Metadata } from "next";
import AboutClient from "./AboutClient";

const SITE_URL = "https://tabaraktech.com";

export const metadata: Metadata = {
  title: "عن مؤسسة تبارك التقنية الذكية",
  description: "تعرف على مؤسسة تبارك التقنية الذكية - رؤيتنا وخدماتنا في بيع الأجهزة الإلكترونية بالأقساط داخل المملكة العربية السعودية.",
  keywords: ["تبارك التقنية", "عن المؤسسة", "أجهزة إلكترونية بالأقساط", "السعودية"],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "عن مؤسسة تبارك التقنية الذكية",
    description: "تعرف على مؤسسة تبارك التقنية الذكية - رؤيتنا وخدماتنا في بيع الأجهزة الإلكترونية بالأقساط داخل المملكة العربية السعودية.",
    locale: "ar_SA",
    siteName: "مؤسسة تبارك التقنية الذكية",
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return <AboutClient />;
}
