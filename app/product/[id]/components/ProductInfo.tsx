"use client";

import { useRouter } from "next/navigation";
import { IoCartOutline, IoCheckmarkCircle, IoShieldCheckmark, IoTimeOutline, IoCarOutline, IoCheckmarkDoneCircle, IoFlash, IoStorefront } from "react-icons/io5";
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

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Price Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg shadow-black/[.04] border border-gray-100/80">
        {/* Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${inStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
            {inStock ? "متوفر الآن" : "غير متوفر"}
          </div>
          {brand && (
            <span className="text-[10px] sm:text-xs font-bold text-[#1F7A8C] bg-[#1F7A8C]/8 px-3 py-1.5 rounded-lg">{brand}</span>
          )}
        </div>

        {/* Name */}
        <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 leading-relaxed mb-3">{name}</h2>

        {/* Tags */}
        {(color || storage || network) && (
          <div className="flex gap-2 mb-5 flex-wrap">
            {[color, storage, network].filter(Boolean).map((t, i) => (
              <span key={i} className="text-[10px] sm:text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">{t}</span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-l from-transparent via-gray-200 to-transparent mb-5" />

        {/* Price */}
        <div className="flex items-end gap-3 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-3xl sm:text-4xl font-black text-red-600 leading-none">{fmt(salePrice)}</span>
              <span className="text-sm font-bold text-red-600/70 mb-1">ر.س</span>
              <div className="flex items-center gap-2 mr-2">
                <span className="text-sm text-gray-400 line-through">{fmt(originalPrice)}</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-white bg-red-500 px-2.5 py-1 rounded-lg shadow-sm shadow-red-500/20">
                  وفّر {fmt(originalPrice - salePrice)}
                </span>
              </div>
            </>
          ) : (
            <>
              <span className="text-3xl sm:text-4xl font-black text-red-600 leading-none">{fmt(originalPrice)}</span>
              <span className="text-sm font-bold text-red-600/70 mb-1">ر.س</span>
            </>
          )}
        </div>
        {taxIncluded && <p className="text-[10px] sm:text-xs text-gray-400 mt-2">شامل ضريبة القيمة المضافة</p>}

        {/* Installment */}
        {installment?.available && (
          <div className="mt-4 bg-gradient-to-l from-[#f0fbe4] to-[#f7fdf0] rounded-2xl px-4 py-3.5 border border-[#7CC043]/15">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#7CC043]/15 flex items-center justify-center shrink-0">
                <IoFlash size={16} className="text-[#5a9030]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#3d6b1a] font-bold">
                  تقسيط متاح {installment.downPayment ? `• مقدم ${fmt(installment.downPayment)} ر.س` : ""}
                </p>
                {installment.note && <p className="text-[10px] sm:text-xs text-[#7CC043] mt-0.5">{installment.note}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {[
          { icon: IoCarOutline, label: freeDelivery ? "توصيل مجاني" : "توصيل مدفوع", sub: deliveryTime, accent: "#1F7A8C" },
          { icon: IoShieldCheckmark, label: "ضمان حاسبات العرب", sub: "سنتين", accent: "#0d4a5e" },
          { icon: IoStorefront, label: inStock ? "متوفر بالمخزون" : "غير متوفر", sub: null, accent: inStock ? "#16a34a" : "#dc2626" },
          { icon: IoTimeOutline, label: "شحن سريع", sub: "خلال 24-48 ساعة", accent: "#7c3aed" },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm border border-gray-100/80 flex items-center gap-3 hover:shadow-md hover:border-gray-200 transition-all">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${f.accent}12` }}>
              <f.icon size={18} style={{ color: f.accent }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-gray-800 leading-snug">{f.label}</p>
              {f.sub && <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">{f.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Cart */}
      <div>
        {!addedToCart ? (
          <button onClick={onAddToCart} className="product-page-cart-btn group w-full">
            <span className="product-page-cart-btn-shine" />
            <span className="relative z-10 flex items-center justify-center gap-2.5">
              <IoCartOutline size={22} className="transition-transform group-hover:scale-110" />
              أضف للسلة
            </span>
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 py-3.5 rounded-2xl border border-emerald-200">
              <IoCheckmarkDoneCircle size={18} />
              <span className="text-sm font-bold">تمت الإضافة للسلة بنجاح ✓</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => router.back()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm py-3.5 rounded-xl transition-colors">
                متابعة التسوق
              </button>
              <button onClick={() => router.push("/cart")} className="bg-[#1E3A8A] text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2">
                <IoCartOutline size={16} /> عرض السلة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
