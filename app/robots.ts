import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/verify/"],
      },
    ],
    sitemap: "https://albilaad-ksa.com/sitemap.xml",
    host: "https://albilaad-ksa.com",
  };
}
