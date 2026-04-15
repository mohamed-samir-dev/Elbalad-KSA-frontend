"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "../../components/products/ProductCard";
import type { Product } from "../../components/products/types";
import { slugConfigs } from "../../lib/categoryConfig";

function filterProducts(products: Product[], slug: string): Product[] {
  const config = slugConfigs[slug];
  if (!config) return products;
  const { brand, category, nameIncludes } = config.filters;
  return products.filter((p) => {
    const matchBrand = brand ? p.brand?.toLowerCase() === brand.toLowerCase() : true;
    const matchCategory = category ? p.category?.trim().toLowerCase() === category.trim().toLowerCase() : false;
    const matchName = nameIncludes?.length
      ? nameIncludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : false;
    if (nameIncludes?.length && category) return (matchBrand && matchName) || matchCategory;
    if (nameIncludes?.length) return matchBrand && matchName;
    if (category) return matchCategory;
    return matchBrand;
  });
}

export default function CategoryPageClient({ slug }: { slug: string }) {
  const config = slugConfigs[slug];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (!config) return;
    const brand = config.filters.brand ?? "";
    const query = brand ? `?brand=${encodeURIComponent(brand)}` : "";
    fetch(`/api/products${query}`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        const filtered = filterProducts(data, slug);
        const parseStorage = (s?: string) => {
          if (!s) return 0;
          const n = parseFloat(s);
          if (s.includes("تيرا") || s.toLowerCase().includes("tb")) return n * 1024;
          return n || 0;
        };
        const colorOrder = (c?: string) => {
          if (!c) return 99;
          if (c.includes("برتقال") || c.toLowerCase().includes("orange")) return 0;
          if (c.includes("سيلفر") || c.toLowerCase().includes("silver")) return 1;
          if (c.includes("ازرق") || c.includes("أزرق") || c.toLowerCase().includes("blue")) return 2;
          return 3;
        };
        const sorted = [...filtered].sort((a, b) => {
          const storageDiff = parseStorage(a.storage) - parseStorage(b.storage);
          if (storageDiff !== 0) return storageDiff;
          return colorOrder(a.color) - colorOrder(b.color);
        });
        setProducts(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, config]);

  if (!config) return notFound();

  const label = config.label ?? slug;
  const parentLabel = config.parentLabel ?? "";
  const parentHref = config.parentHref ?? "/";

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <div className="bg-white border-b border-white shadow-none">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#1F6F8B] mb-2 sm:mb-3">
            <Link href="/" className="hover:text-[#0F4C6E] transition">الرئيسية</Link>
            <span>/</span>
            <Link href={parentHref} className="hover:text-[#0F4C6E] transition">{parentLabel}</Link>
            <span>/</span>
            <span className="text-[#0F4C6E] font-medium truncate max-w-[140px] sm:max-w-none">{label}</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-[#0a3550]">{label}</h1>
          <p className="text-xs sm:text-sm text-[#1F6F8B]">جميع المنتجات المتوفرة</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-52 sm:h-64 animate-pulse" />
            ))}
          </div>
        ) : !products.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <span className="text-5xl">📦</span>
            <p className="text-gray-500 text-base font-medium">المنتجات ستُضاف قريباً</p>
            <p className="text-gray-400 text-sm">هذا القسم قيد التحضير، تابعنا للمزيد</p>
            <Link href="/" className="mt-2 text-sm text-[#0F4C6E] hover:underline">← العودة إلى الرئيسية</Link>
          </div>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{products.length} منتج</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((p) => (<ProductCard key={p._id} product={p} />))}
            </div>
            {products.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-[#E6F2F8] hover:border-[#0F4C6E] transition"
                >
                  السابق
                </button>
                {Array.from({ length: Math.ceil(products.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg border text-sm font-medium transition ${
                      page === n ? "bg-[#0F4C6E] text-white border-[#0F4C6E]" : "hover:bg-[#E6F2F8] hover:border-[#0F4C6E]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(Math.ceil(products.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={page === Math.ceil(products.length / ITEMS_PER_PAGE)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-[#E6F2F8] hover:border-[#0F4C6E] transition"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
