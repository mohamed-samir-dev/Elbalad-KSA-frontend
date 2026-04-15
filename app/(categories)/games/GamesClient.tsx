"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../../components/products/ProductCard";
import type { Product } from "../../components/products/types";

export default function GamesClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetch(`/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data.filter((p) => p.category === "اكسسورات"));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#1F6F8B] mb-2">
            <Link href="/" className="hover:text-[#0F4C6E] transition">الرئيسية</Link>
            <span>/</span>
            <span className="text-[#0F4C6E] font-medium">اكسسورات</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-[#0a3550]">اكسسورات</h1>
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
            <Link href="/" className="mt-2 text-sm text-[#0F4C6E] hover:underline">← العودة إلى الرئيسية</Link>
          </div>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{products.length} منتج</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40 hover:bg-[#E6F2F8] hover:border-[#0F4C6E] transition"
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
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
