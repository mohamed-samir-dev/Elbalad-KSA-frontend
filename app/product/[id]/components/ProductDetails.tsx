"use client";

import { useState } from "react";
import { IoCheckmarkCircle, IoDocumentTextOutline, IoListOutline, IoCardOutline } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("ar-SA");

const specLabels: [keyof NonNullable<Product["specs"]>, string, string][] = [
  ["screen", "الشاشة", "📱"], ["processor", "المعالج", "⚡"], ["ram", "الرام", "🧠"], ["storage", "التخزين", "💾"],
  ["rearCamera", "الكاميرا الخلفية", "📸"], ["frontCamera", "الكاميرا الأمامية", "🤳"],
  ["battery", "البطارية", "🔋"], ["batteryLife", "عمر البطارية", "⏱"], ["charging", "الشحن", "🔌"],
  ["os", "نظام التشغيل", "💻"], ["extras", "مميزات إضافية", "✨"],
];

interface ProductDetailsProps {
  installment?: Product["installment"];
  description?: string;
  specs?: Product["specs"];
}

type Tab = "specs" | "installment" | "description";

const tabMeta: Record<Tab, { icon: typeof IoListOutline; label: string }> = {
  specs: { icon: IoListOutline, label: "المواصفات" },
  description: { icon: IoDocumentTextOutline, label: "الوصف" },
  installment: { icon: IoCardOutline, label: "التقسيط" },
};

export default function ProductDetails({ installment, description, specs }: ProductDetailsProps) {
  const hasSpecs = specs && Object.values(specs).some(Boolean);

  const tabs: { key: Tab; show: boolean }[] = [
    { key: "specs", show: !!hasSpecs },
    { key: "description", show: !!description },
    { key: "installment", show: !!installment?.available },
  ];
  const visibleTabs = tabs.filter((t) => t.show);
  const [active, setActive] = useState<Tab>(visibleTabs[0]?.key || "specs");

  if (!visibleTabs.length) return null;

  return (
    <div className="mt-6 sm:mt-10 bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-black/[.04] border border-gray-100/80 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {visibleTabs.map((t) => {
          const m = tabMeta[t.key];
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 py-4 sm:py-5 text-xs sm:text-sm font-bold transition-all relative ${isActive ? "text-[#1F7A8C]" : "text-gray-400 hover:text-gray-600"}`}
            >
              <m.icon size={16} />
              {m.label}
              {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-[3px] bg-[#1F7A8C] rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-7">
        {/* Specs */}
        {active === "specs" && hasSpecs && (
          <div className="rounded-2xl overflow-hidden border border-gray-100">
            {specLabels.map(([key, label, emoji], i) =>
              specs[key] ? (
                <div key={key} className={`flex items-center text-xs sm:text-sm px-4 sm:px-5 py-3.5 sm:py-4 gap-3 ${i % 2 === 0 ? "bg-[#f8fafb]" : "bg-white"}`}>
                  <span className="text-sm">{emoji}</span>
                  <span className="text-gray-400 w-28 sm:w-36 shrink-0 font-semibold">{label}</span>
                  <span className="text-gray-800 flex-1 min-w-0 break-words font-semibold">{specs[key]}</span>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Description */}
        {active === "description" && description && (() => {
          const lines = description.split("\n").map(l => l.trim()).filter(Boolean);
          const title = lines[0];
          const items = lines.slice(1);
          return (
            <div>
              {title && (
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F7A8C]/12 to-[#1F7A8C]/5 flex items-center justify-center">
                    <IoDocumentTextOutline size={18} className="text-[#1F7A8C]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-gray-800">{title}</h3>
                </div>
              )}
              {items.length > 0 && (
                <div className="flex flex-col gap-2">
                  {items.map((line, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl ${i % 2 === 0 ? "bg-[#f8fafb]" : "bg-white"}`}>
                      <IoCheckmarkCircle size={16} className="text-[#1F7A8C] shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{line.replace(/^[•\-\*]\s*/, "")}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-center">
                <p className="text-[10px] sm:text-xs font-bold text-amber-700">⚠️ عدم استيفاء أي من الشروط أعلاه قد يؤدي إلى رفض الطلب</p>
              </div>
            </div>
          );
        })()}

        {/* Installment */}
        {active === "installment" && installment?.available && (
          <div className="space-y-5">
            <div className="bg-gradient-to-l from-[#f0fbe4] to-[#f7fdf0] rounded-2xl p-5 border border-[#7CC043]/10">
              <p className="text-sm sm:text-base font-bold text-[#3d6b1a]">
                احصل عليه بأقساط شهرية مريحة
                {installment.downPayment ? ` • مقدم ${fmt(installment.downPayment)} ر.س` : ""}
              </p>
              {installment.note && <p className="text-xs text-[#7CC043] mt-2">{installment.note}</p>}
            </div>
            {installment.policy && (
              <div className="text-center py-2">
                <span className="text-xs sm:text-sm font-bold text-amber-600">♕ {installment.policy} ♕</span>
              </div>
            )}
            {installment.conditions && installment.conditions.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">شروط التقديم</p>
                <div className="flex flex-col gap-2.5">
                  {installment.conditions.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3">
                      <IoCheckmarkCircle size={16} className="text-[#1F7A8C] shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
