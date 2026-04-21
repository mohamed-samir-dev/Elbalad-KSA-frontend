"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoCartOutline, IoCheckmarkCircleOutline, IoFlash, IoCarOutline, IoShieldCheckmark } from "react-icons/io5";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) => {
  if (src.startsWith("http")) {
    const idx = src.indexOf("https://", 8);
    return idx > 0 ? src.substring(idx) : src;
  }
  return `${API}${src.startsWith("/") ? src : "/" + src}`;
};

function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { name, salePrice, discountPercent = 0, color, storage, network, installment, freeDelivery, inStock } = product;
  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setAdded(false);
      window.scrollTo(0, 0);
      window.location.href = "/cart";
    }, 800);
  }, [addItem, product]);

  const tags = [color, storage, network].filter(Boolean);

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-base font-medium animate-fade-in-down">
          <IoCheckmarkCircleOutline size={18} />
          تمت إضافة المنتج للسلة
        </div>
      )}
      <Link
        href={`/product/${product._id}`}
        className="product-card-v3 group relative flex flex-col h-full overflow-hidden"
        dir="rtl"
      >
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute z-10 top-2.5 left-2.5 sm:top-3 sm:left-3">
            <div className="bg-red-600 text-white text-[9px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-lg shadow-red-600/30 flex items-center gap-1">
              <IoFlash size={10} />
              {discountPercent}%-
            </div>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute z-10 top-2.5 right-2.5 sm:top-3 sm:right-3">
          <div className={`text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md ${inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
            {inStock ? "متوفر" : "نفذ"}
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full bg-gradient-to-b from-[#f0f9fa] via-[#f7fbfc] to-white" style={{ paddingBottom: "110%" }}>
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            {resolvedImage ? (
              <Image
                src={resolvedImage}
                alt={name}
                fill
                className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl sm:text-6xl">📱</div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-gradient-to-l from-transparent via-[#1F7A8C]/20 to-transparent" />

        {/* Content */}
        <div className="px-2.5 sm:px-4 pt-3 sm:pt-4 pb-2 flex flex-col gap-2 sm:gap-2.5 flex-1">
          {/* Name */}
          <h3 className="text-[11px] sm:text-sm md:text-[15px] font-bold text-gray-800 leading-snug line-clamp-2 min-h-[32px] sm:min-h-[40px]">
            {name}
          </h3>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-1 sm:gap-1.5 flex-wrap">
              {tags.map((t, i) => (
                <span key={i} className="text-[8px] sm:text-[10px] font-semibold text-[#1F7A8C] bg-[#1F7A8C]/8 px-1.5 sm:px-2 py-0.5 rounded-md">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="mt-auto pt-1">
            {hasDiscount ? (
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">{fmt(originalPrice)} ر.س</span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">وفّر {fmt(originalPrice - salePrice!)}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-xl md:text-2xl font-black text-red-600">{fmt(salePrice!)}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-red-600/70">ر.س</span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-xl md:text-2xl font-black text-red-600">{fmt(originalPrice)}</span>
                <span className="text-[10px] sm:text-xs font-bold text-red-600/70">ر.س</span>
              </div>
            )}
           
          </div>

          {/* Installment */}
          {installment?.available && (
            <div className="bg-[#7CC043]/10 rounded-lg px-2 sm:px-2.5 py-1.5 sm:py-2">
              <p className="text-[8px] sm:text-[10px] font-bold text-[#5a9030] flex items-center gap-1">
                💳 تقسيط متاح {installment.downPayment ? `من ${fmt(installment.downPayment)} ر.س` : ""}
              </p>
            </div>
          )}

          {/* Mini Features */}
          <div className="flex items-center gap-2 sm:gap-3 pt-0.5">
            {freeDelivery && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                <IoCarOutline size={11} className="text-[#1F7A8C] shrink-0" />
                <span className="text-[7px] sm:text-[9px] font-semibold text-gray-500">توصيل مجاني</span>
              </div>
            )}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <IoShieldCheckmark size={11} className="text-[#1F7A8C] shrink-0" />
              <span className="text-[7px] sm:text-[9px] font-semibold text-gray-500">ضمان</span>
            </div>
          </div>
        </div>

        {/* Cart Button */}
        <div className="px-2.5 sm:px-4 pb-3 sm:pb-4 pt-1">
          <button
            onClick={handleAddToCart}
            className={`cart-btn-v2 ${added ? "cart-btn-v2-added" : ""}`}
          >
            <span className="cart-btn-v2-bg" />
            <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
              {added ? (
                <><IoCheckmarkCircleOutline className="text-[14px] sm:text-[16px] lg:text-[18px]" />تمت الإضافة</>
              ) : (
                <><IoCartOutline className="text-[14px] sm:text-[16px] lg:text-[18px]" />أضف للسلة</>
              )}
            </span>
          </button>
        </div>
      </Link>
    </>
  );
}

export default memo(ProductCard);
