"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoCartOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
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
  const { name, salePrice, discountPercent = 0 } = product;
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
        className="product-card-v2 group relative flex flex-col h-full overflow-hidden"
        dir="rtl"
      >
        {/* Discount Ribbon */}
        {discountPercent > 0 && (
          <div className="absolute z-10 top-0 left-0">
            <div className="bg-red-600 text-white text-[9px] sm:text-[11px] font-bold px-3 sm:px-4 py-1 rounded-br-xl rounded-tl-[14px] sm:rounded-tl-[18px] shadow-md">
              خصم {discountPercent}%
            </div>
          </div>
        )}

        {/* Image Area */}
        <div className="relative w-full bg-gradient-to-b from-[#f0f9fa] to-white" style={{ paddingBottom: "100%" }}>
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
            {resolvedImage ? (
              <Image
                src={resolvedImage}
                alt={name}
                fill
                className="object-contain p-3 sm:p-5 transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl sm:text-5xl">📱</div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-gradient-to-l from-transparent via-[#1F7A8C]/30 to-transparent" />

        {/* Content */}
        <div className="px-2.5 sm:px-3.5 pt-2.5 sm:pt-3 pb-1.5 flex flex-col gap-1.5 flex-1">
          <h3 className="text-[11px] sm:text-sm md:text-base font-bold text-gray-800 leading-snug line-clamp-2">
            {name}
          </h3>

          <div className="flex items-end gap-2 mt-auto" dir="rtl">
            {hasDiscount ? (
              <>
                <span className="text-sm sm:text-lg md:text-xl font-extrabold text-red-600">
                  {fmt(salePrice)} <span className="text-[10px] sm:text-xs font-semibold">ر.س</span>
                </span>
                <span className="text-[10px] sm:text-xs text-gray-400 line-through mb-0.5">
                  {fmt(originalPrice)}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-lg md:text-xl font-extrabold text-red-600">
                {fmt(originalPrice)} <span className="text-[10px] sm:text-xs font-semibold">ر.س</span>
              </span>
            )}
          </div>
        </div>

        {/* Cart Button */}
        <div className="px-2.5 sm:px-3.5 pb-2.5 sm:pb-3 pt-1.5">
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
