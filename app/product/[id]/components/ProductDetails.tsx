"use client";

import { useState } from "react";
import { IoCheckmarkCircle, IoDocumentTextOutline } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("ar-SA");

const specLabels: [keyof NonNullable<Product["specs"]>, string][] = [
  ["screen", "الشاشة"], ["processor", "المعالج"], ["ram", "الرام"], ["storage", "التخزين"],
  ["rearCamera", "الكاميرا الخلفية"], ["frontCamera", "الكاميرا الأمامية"],
  ["battery", "البطارية"], ["batteryLife", "عمر البطارية"], ["charging", "الشحن"],
  ["os", "نظام التشغيل"], ["extras", "مميزات إضافية"],
];

interface ProductDetailsProps {
  installment?: Product["installment"];
  description?: string;
  specs?: Product["specs"];
}

type Tab = "specs" | "installment" | "description";

export default function ProductDetails({ installment, description, specs }: ProductDetailsProps) {
  const hasSpecs = specs && Object.values(specs).some(Boolean);

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: "specs", label: "المواصفات", show: !!hasSpecs },
    { key: "description", label: "الوصف", show: !!description },
    { key: "installment", label: "التقسيط", show: !!installment?.available },
  ];
  const visibleTabs = tabs.filter((t) => t.show);
  const [active, setActive] = useState<Tab>(visibleTabs[0]?.key || "specs");

  if (!visibleTabs.length) return null;

  return (
    <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {visibleTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`flex-1 min-w-[100px] text-xs sm:text-sm font-bold py-3 sm:py-4 text-center transition-colors relative ${
              active === t.key ? "text-[#1F7A8C]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.label}
            {active === t.key && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-[#1F7A8C] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {/* Specs */}
        {active === "specs" && hasSpecs && (
          <div className="space-y-0 rounded-xl overflow-hidden">
            {specLabels.map(([key, label], i) =>
              specs[key] ? (
                <div key={key} className={`flex text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-3.5 ${i % 2 === 0 ? "bg-[#f0f9fa]" : "bg-white"}`}>
                  <span className="text-gray-400 w-28 sm:w-36 shrink-0 font-medium">{label}</span>
                  <span className="text-gray-800 flex-1 min-w-0 break-words font-medium">{specs[key]}</span>
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
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1F7A8C]/10">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1F7A8C]/15 to-[#1F7A8C]/5 flex items-center justify-center">
                    <IoDocumentTextOutline size={18} className="text-[#1F7A8C]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800">{title}</h3>
                </div>
              )}
              {items.length > 0 && (
                <div className="flex flex-col gap-2">
                  {items.map((line, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl ${i % 2 === 0 ? "bg-[#f0f9fa]" : "bg-white"}`}>
                      <IoCheckmarkCircle size={16} className="text-[#1F7A8C] shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{line.replace(/^[•\-\*]\s*/, "")}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-center">
                <p className="text-[10px] sm:text-xs font-bold text-amber-700">
                  ⚠️ عدم استيفاء أي من الشروط أعلاه قد يؤدي إلى رفض الطلب
                </p>
              </div>
            </div>
          );
        })()}

        {/* Installment */}
        {active === "installment" && installment?.available && (
          <div className="space-y-4">
            <div className="bg-[#7CC043]/10 rounded-xl p-3.5 sm:p-4">
              <p className="text-xs sm:text-sm font-semibold text-[#5a9030]">
                احصل عليه بأقساط شهرية
                {installment.downPayment ? ` تبدأ بدفعة ${fmt(installment.downPayment)} ر.س والباقي أقساط` : ""}
              </p>
              {installment.note && <p className="text-[10px] sm:text-xs text-[#7CC043] mt-1.5">{installment.note}</p>}
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
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600">
                      <IoCheckmarkCircle size={15} className="text-[#1F7A8C] shrink-0 mt-0.5" />
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
