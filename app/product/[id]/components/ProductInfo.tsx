"use client";

import { useRouter } from "next/navigation";
import { IoCartOutline, IoCheckmarkCircle, IoShieldCheckmark, IoTimeOutline, IoCarOutline, IoCheckmarkDoneCircle } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

interface ProductInfoProps {
  product: Product;
  addedToCart: boolean;
  onAddToCart: () => void;
}

export default function ProductInfo({ product, addedToCart, onAddToCart }: ProductInfoProps) {
  const router = useRouter();
  const { name, brand, color, storage, network, salePrice, taxIncluded, installment, freeDelivery, deliveryTime, inStock } = product;
  const originalPrice = product.originalPrice ?? 0;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;

  const features = [
    { icon: IoCarOutline, label: freeDelivery ? "توصيل مجاني" : "توصيل مدفوع", sub: deliveryTime },
    { icon: IoShieldCheckmark, label: "ضمان حاسبات العرب سنتين", sub: null },
    { icon: IoCheckmarkCircle, label: inStock ? "متوفر في المخزون" : "غير متوفر", sub: null, color: inStock ? undefined : "text-red-500" },
    { icon: IoTimeOutline, label: "شحن سريع", sub: null },
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Name & Tags */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
        {brand && (
          <span className="inline-block text-[10px] sm:text-xs font-bold text-[#1F7A8C] bg-[#1F7A8C]/10 px-2.5 py-1 rounded-md mb-2">
            {brand}
          </span>
        )}
        <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-gray-900 leading-relaxed">{name}</h2>
        {(color || storage || network) && (
          <div className="flex gap-1.5 sm:gap-2 mt-3 flex-wrap">
            {[color, storage, network].filter(Boolean).map((t, i) => (
              <span key={i} className="text-[10px] sm:text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <div className="flex items-end gap-3 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-2xl sm:text-3xl font-black text-red-600">{fmt(salePrice)}</span>
              <span className="text-sm sm:text-base font-bold text-red-600 mb-0.5">ر.س</span>
              <div className="flex items-center gap-2 mr-1">
                <span className="text-sm text-gray-400 line-through">{fmt(originalPrice)} ر.س</span>
                <span className="text-[10px] sm:text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-md">وفّر {fmt(originalPrice - salePrice)}</span>
              </div>
            </>
          ) : (
            <>
              <span className="text-2xl sm:text-3xl font-black text-red-600">{fmt(originalPrice)}</span>
              <span className="text-sm sm:text-base font-bold text-red-600 mb-0.5">ر.س</span>
            </>
          )}
        </div>
        {taxIncluded && <p className="text-[10px] sm:text-xs text-gray-400 mt-2">شامل ضريبة القيمة المضافة</p>}
        {installment?.available && (
          <div className="mt-3 bg-[#7CC043]/10 rounded-xl px-3 py-2.5">
            <p className="text-xs sm:text-sm text-[#5a9030] font-semibold">
              💳 تقسيط متاح {installment.downPayment ? `- مقدم ${fmt(installment.downPayment)} ر.س` : ""} {installment.note || ""}
            </p>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {features.map((f, i) => (
          <div key={i} className="bg-white rounded-xl p-2.5 sm:p-3.5 shadow-sm border border-gray-100 flex items-center gap-2.5 hover:border-[#1F7A8C]/20 transition-colors">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1F7A8C]/10 flex items-center justify-center shrink-0">
              <f.icon size={16} className={f.color || "text-[#1F7A8C]"} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-gray-700 truncate">{f.label}</p>
              {f.sub && <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">{f.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Button */}
      {!addedToCart ? (
        <button onClick={onAddToCart} className="product-page-cart-btn group">
          <span className="product-page-cart-btn-shine" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <IoCartOutline size={20} className="transition-transform group-hover:scale-110" />
            أضف للسلة
          </span>
        </button>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-center gap-2 text-[#1E3A8A] bg-[#1E3A8A]/10 py-3 rounded-xl border border-[#1E3A8A]/20">
            <IoCheckmarkDoneCircle size={18} />
            <span className="text-xs sm:text-sm font-bold">تمت الإضافة للسلة بنجاح ✓</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => router.back()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm py-3 rounded-xl transition-colors"
            >
              متابعة التسوق
            </button>
            <button
              onClick={() => router.push("/cart")}
              className="bg-[#1E3A8A]  text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <IoCartOutline size={16} />
              عرض السلة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
