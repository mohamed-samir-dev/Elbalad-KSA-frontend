"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoArrowForward, IoShareSocial } from "react-icons/io5";
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
  const [scrolled, setScrolled] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  if (!product)
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400 text-lg">المنتج غير موجود</p></div>;

  const resolveImg = (src: string) =>
    src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;
  const allImages = (product.images?.length ? product.images : product.image ? [product.image] : []).map(resolveImg);

  const handleShare = async () => {
    try { await navigator.share({ title: product.name, url: window.location.href }); } catch {}
  };

  return (
    <>
      <style>{`
        @keyframes pdpGrad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
        .pdp-hero{background:linear-gradient(-45deg,#071e2b,#0f3d4f,#1a6b7d,#0d4a5e);background-size:300% 300%;animation:pdpGrad 10s ease infinite}
        .pdp-fade{animation:fadeUp .5s ease both}
        .pdp-scale{animation:scaleIn .45s ease both}
        .pdp-glass{background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1)}
      `}</style>

      <main className="min-h-screen pb-24 sm:pb-16" dir="rtl" style={{ background: "#f4f6f8" }}>
        {/* Sticky Nav */}
        <div className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-md" : "bg-transparent"}`}>
          <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button onClick={() => router.back()} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${scrolled ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "pdp-glass text-white"}`}>
                <IoArrowForward size={18} />
              </button>
              <h1 className={`text-xs sm:text-sm font-bold truncate max-w-[200px] sm:max-w-none transition-colors ${scrolled ? "text-gray-800" : "text-white/90"}`}>{product.name}</h1>
            </div>
            <button onClick={handleShare} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${scrolled ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "pdp-glass text-white"}`}>
              <IoShareSocial size={16} />
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="pdp-hero -mt-[52px] pt-[52px] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-72 h-72 bg-white/[.04] rounded-full -top-20 -left-20" />
            <div className="absolute w-56 h-56 bg-white/[.03] rounded-full -bottom-10 -right-10" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 pt-8 sm:pt-12 pb-14 sm:pb-20 text-center">
            {product.brand && (
              <span className="pdp-fade inline-block text-[10px] sm:text-xs font-bold text-white/80 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10 mb-3">
                {product.brand}
              </span>
            )}
            <h2 className="pdp-fade text-xl sm:text-3xl lg:text-4xl font-black text-white leading-snug mb-2" style={{ animationDelay: ".05s" }}>{product.name}</h2>
            {(product.color || product.storage || product.network) && (
              <div className="pdp-fade flex gap-2 justify-center flex-wrap mt-2" style={{ animationDelay: ".1s" }}>
                {[product.color, product.storage, product.network].filter(Boolean).map((t, i) => (
                  <span key={i} className="text-[10px] sm:text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/10">{t}</span>
                ))}
              </div>
            )}
          </div>
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60Z" fill="#f4f6f8"/></svg>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-3 sm:px-5 -mt-6 sm:-mt-10 relative z-10">
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
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 safe-bottom">
          <div className="flex items-center gap-3" dir="rtl">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-500 truncate">{product.name}</p>
              <p className="text-base font-black text-red-600">{(product.salePrice ?? product.originalPrice ?? 0).toLocaleString("en-US")} <span className="text-xs font-bold">ر.س</span></p>
            </div>
            {!addedToCart ? (
              <button onClick={() => { addItem(product); setAddedToCart(true); }} className="bg-gradient-to-l from-[#1a6b7d] to-[#155e6f] text-white font-bold text-sm px-7 py-3 rounded-xl shadow-lg shadow-[#1a6b7d]/30 active:scale-95 transition-transform">
                أضف للسلة
              </button>
            ) : (
              <button onClick={() => router.push("/cart")} className="bg-emerald-600 text-white font-bold text-sm px-7 py-3 rounded-xl shadow-lg shadow-emerald-600/30">
                عرض السلة ✓
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
