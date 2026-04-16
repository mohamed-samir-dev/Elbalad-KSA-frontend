"use client";

import { useState } from "react";
import { IoCheckmarkCircle, IoPersonOutline, IoCashOutline, IoCallOutline, IoDocumentTextOutline, IoCalendarOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("ar-SA");

const specLabels: [keyof NonNullable<Product["specs"]>, string][] = [
  ["screen", "الشاشة"], ["processor", "المعالج"], ["ram", "الرام"], ["storage", "التخزين"],
  ["rearCamera", "الكاميرا الخلفية"], ["frontCamera", "الكاميرا الأمامية"],
  ["battery", "البطارية"], ["batteryLife", "عمر البطارية"], ["charging", "الشحن"],
  ["os", "نظام التشغيل"], ["extras", "مميزات إضافية"],
];

const conditionIcons = [
  IoPersonOutline,
  IoCashOutline,
  IoCallOutline,
  IoDocumentTextOutline,
  IoCalendarOutline,
];

interface ProductDetailsProps {
  installment?: Product["installment"];
  description?: string;
  specs?: Product["specs"];
}

type Tab = "specs" | "installment" | "description";

function parseConditions(desc: string) {
  const lines = desc.split("\n").map((l) => l.trim()).filter(Boolean);
  const title = lines[0]?.replace(/:$/, "") || "";
  const items = lines.slice(1).map((l) => l.replace(/^[•\-\*]\s*/, ""));
  return { title, items };
}

export default function ProductDetails({ installment, description, specs }: ProductDetailsProps) {
  const hasSpecs = specs && Object.values(specs).some(Boolean);
  const isConditions = description?.includes("الشروط الواجب توفرها");

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: "specs", label: "المواصفات", show: !!hasSpecs },
    { key: "description", label: isConditions ? "شروط التقسيط" : "الوصف", show: !!description },
    { key: "installment", label: "التقسيط", show: !!installment?.available },
  ];
  const visibleTabs = tabs.filter((t) => t.show);
  const [active, setActive] = useState<Tab>(visibleTabs[0]?.key || "specs");

  if (!visibleTabs.length) return null;

  const parsed = isConditions && description ? parseConditions(description) : null;

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

        {/* Description - Conditions Style */}
        {active === "description" && description && isConditions && parsed && (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#1F7A8C] to-[#155E6F] flex items-center justify-center shadow-md shadow-[#1F7A8C]/20">
                <IoShieldCheckmarkOutline size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900">{parsed.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">يرجى التأكد من استيفاء جميع الشروط</p>
              </div>
            </div>

            {/* Conditions Cards */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {parsed.items.map((item, i) => {
                const Icon = conditionIcons[i % conditionIcons.length];
                return (
                  <div
                    key={i}
                    className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 bg-gradient-to-l from-[#f0f9fa]/60 to-white hover:border-[#1F7A8C]/20 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1F7A8C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1F7A8C]/15 transition-colors">
                      <Icon size={16} className="text-[#1F7A8C]" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed">{item}</p>
                    </div>
                    <div className="shrink-0 pt-0.5 sm:pt-1">
                      <IoCheckmarkCircle size={18} className="text-[#7CC043]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Note */}
            <div className="mt-4 sm:mt-5 bg-amber-50 border border-amber-100 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-center">
              <p className="text-[10px] sm:text-xs font-bold text-amber-700">
                ⚠️ عدم استيفاء أي من الشروط أعلاه قد يؤدي إلى رفض الطلب
              </p>
            </div>
          </div>
        )}

        {/* Description - Normal */}
        {active === "description" && description && !isConditions && (
          <p className="text-xs sm:text-sm text-gray-600 leading-loose whitespace-pre-line">{description}</p>
        )}

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
