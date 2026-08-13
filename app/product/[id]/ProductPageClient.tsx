"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowForward, IoShareSocial, IoHomeOutline, IoCartOutline, IoCheckmarkDoneCircle } from "react-icons/io5";
import type { Product } from "../../components/products/types";
import { useCartStore } from "../../store/cartStore";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductDetails from "./components/ProductDetails";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductPageClient({ id, initialProduct }: { id: string; initialProduct: Product | null }) {
  const router = useRouter();
  const [product] = useState<Product | null>(initialProduct);
  const [addedToCart, setAddedToCart] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobilePopup, setMobilePopup] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!product)
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400 text-lg">المنتج غير موجود</p></div>;

  const handleMobileAdd = () => {
    setMobileLoading(true);
    setTimeout(() => {
      setMobileLoading(false);
      addItem(product);
      setAddedToCart(true);
      setMobilePopup(true);
      setTimeout(() => setMobilePopup(false), 3000);
    }, 600);
  };

  const resolveImg = (src: string) =>
    src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;
  const merged = [...(product.images || []), ...(product.image ? [product.image] : [])];
  const allImages = [...new Set(merged)].map(resolveImg);

  const handleShare = async () => {
    try { await navigator.share({ title: product.name, url: window.location.href }); } catch {}
  };

  return (
    <>
      <main className="min-h-screen pb-24 sm:pb-16" dir="rtl" style={{ background: "#f4f6f8" }}>
        {/* Sticky Nav / Breadcrumb */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-3 sm:px-5 py-3 flex items-center justify-between gap-3">
            {/* Back + Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => router.back()}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-l from-[#1a6b7d] to-[#155e6f] text-white shadow-md shadow-[#1a6b7d]/30 active:scale-95 transition-transform"
              >
                <IoArrowForward size={18} />
              </button>
              <nav className="flex items-center min-w-0" aria-label="breadcrumb">
                <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-[#1a6b7d] transition-colors text-xs sm:text-sm flex-shrink-0">
                  <IoHomeOutline size={14} />
                  <span>الرئيسية</span>
                </Link>
                <span className="breadcrumb-sep flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{product.name}</span>
              </nav>
            </div>
            {/* Share */}
            <button
              onClick={handleShare}
              className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-l from-[#1a6b7d] to-[#155e6f] text-white shadow-md shadow-[#1a6b7d]/30 active:scale-95 transition-transform"
              title="مشاركة"
            >
              <IoShareSocial size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-3 sm:px-5 mt-4 sm:mt-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-7">
            {/* Images */}
            <div className="lg:col-span-7 pdp-scale">
              <ProductImages images={allImages} name={product.name} discountPercent={product.discountPercent} />
            </div>
            {/* Info */}
            <div className="lg:col-span-5 pdp-scale" style={{ animationDelay: ".1s" }}>
              <ProductInfo product={product} addedToCart={addedToCart} onAddToCart={() => { addItem(product); setAddedToCart(true); }} />
            </div>
          </div>

          <ProductDetails installment={product.installment} description={product.description} specs={product.specs} />
        </div>

        {/* Mobile Floating CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden" dir="rtl">
          {/* Mobile Popup */}
          {mobilePopup && (
            <div className="mx-4 mb-2 pdp-popup">
              <div className="bg-gradient-to-l from-[#1a6b7d] to-[#155e6f] rounded-2xl px-4 py-3 shadow-lg shadow-[#1a6b7d]/30 flex items-center gap-3">
                <IoCheckmarkDoneCircle size={18} className="text-white shrink-0" />
                <span className="text-sm font-bold text-white">تمت إضافة المنتج للسلة بنجاح</span>
              </div>
            </div>
          )}
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 safe-bottom">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 truncate">{product.name}</p>
                <p className="text-base font-black text-red-600">{(product.salePrice ?? product.originalPrice ?? 0).toLocaleString("en-US")} <span className="text-xs font-bold">ر.س</span></p>
              </div>
              {!addedToCart ? (
                <button
                  onClick={handleMobileAdd}
                  disabled={mobileLoading}
                  className="bg-gradient-to-l from-[#1a6b7d] to-[#155e6f] text-white font-bold text-sm px-7 py-3 rounded-xl shadow-lg shadow-[#1a6b7d]/30 active:scale-95 transition-transform flex items-center gap-2 disabled:opacity-80"
                >
                  {mobileLoading ? (
                    <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <><IoCartOutline size={18} /> أضف للسلة</>
                  )}
                </button>
              ) : (
                <button onClick={() => router.push("/cart")} className="bg-gradient-to-l from-[#1a6b7d] to-[#155e6f] text-white font-bold text-sm px-7 py-3 rounded-xl shadow-lg shadow-[#1a6b7d]/30 active:scale-95 transition-transform flex items-center gap-2">
                  <IoCartOutline size={18} /> عرض السلة
                </button>
              )}
            </div>
          </div>
          <style>{`
            @keyframes popupIn{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
            @keyframes shimmer{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
            @keyframes shrink{from{width:100%}to{width:0%}}
          `}</style>
        </div>
      </main>
    </>
  );
}