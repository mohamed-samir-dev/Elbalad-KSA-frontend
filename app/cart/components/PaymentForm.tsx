"use client";

import { useState, useMemo } from "react";
import { CreditCard, ChevronDown, Calendar, Wallet, CheckCircle2, ArrowRight, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { CustomerInfo } from "../../store/cartStore";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toString();

const DISCOUNT_VALUE = 100;

interface Props {
  total: number;
  itemCount: number;
  initialData?: Partial<CustomerInfo>;
  installmentMonths?: number;
  onBack: () => void;
  onSubmit: (info: CustomerInfo) => void;
}

export default function PaymentForm({ total, itemCount, initialData, installmentMonths, onBack, onSubmit }: Props) {
  const { pendingDiscountCode } = useCartStore();

  const maxMonths = installmentMonths ?? 24;
  const MONTHS_OPTIONS = Array.from({ length: Math.floor(maxMonths / 2) }, (_, i) => (i + 1) * 2);

  const minDown = 500 * itemCount;
  const DOWN_OPTIONS = [
    { label: "500 ر.س", amount: 500 },
    { label: "1,000 ر.س", amount: 1000 },
    { label: "1,500 ر.س", amount: 1500 },
  ];

  const [installmentType, setInstallmentType] = useState<"full" | "installment">(initialData?.installmentType ?? "installment");
  const [installmentProvider, setInstallmentProvider] = useState<"tabby" | "tamara" | "store">(initialData?.installmentProvider ?? "tabby");
  const [months, setMonths] = useState(initialData?.months ?? 12);
  const [downPayment, setDownPayment] = useState(DOWN_OPTIONS[0].amount);
  const [showSchedule, setShowSchedule] = useState(false);

  // Discount
  const [discountCode, setDiscountCode] = useState(initialData?.discountCode ?? pendingDiscountCode ?? "");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");

  const discountAmount = discountApplied ? DISCOUNT_VALUE : 0;
  const finalTotal = total - discountAmount;

  const monthly = useMemo(() => {
    if (installmentType === "full") return 0;
    const rem = finalTotal - downPayment;
    return rem > 0 ? Math.ceil(rem / months) : 0;
  }, [finalTotal, months, installmentType, downPayment]);

  const schedule = useMemo(() => {
    const now = new Date();
    return Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i + 1, now.getDate());
      return {
        index: i + 1,
        date: `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`,
        amount: monthly,
      };
    });
  }, [months, monthly]);

  function applyDiscount() {
    if (!discountCode.trim()) {
      setDiscountError("أدخل كود الخصم أولاً");
      return;
    }
    if (discountCode.trim().toUpperCase() === (pendingDiscountCode ?? "").toUpperCase() || discountCode.trim().length >= 6) {
      setDiscountApplied(true);
      setDiscountError("");
    } else {
      setDiscountError("كود الخصم غير صحيح");
    }
  }

  const handleSubmit = () => {
    onSubmit({
      name: initialData?.name ?? "",
      nationalId: initialData?.nationalId ?? "",
      whatsapp: initialData?.whatsapp ?? "",
      address: initialData?.address ?? "",
      installmentType,
      installmentProvider: installmentType === "installment" ? installmentProvider : undefined,
      storeInstallment: installmentType === "installment" && installmentProvider === "store",
      months,
      downPayment,
      discountCode: discountApplied ? discountCode : undefined,
      discountAmount: discountApplied ? discountAmount : undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#1a6b7d] font-semibold hover:underline">
        <ArrowRight size={15} />
        رجوع لبيانات الشحن
      </button>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1a6b7d]/10 rounded-lg flex items-center justify-center">
            <CreditCard size={15} className="text-[#1a6b7d]" />
          </div>
          <h2 className="text-sm font-bold text-gray-800">طريقة الدفع</h2>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Full / Installment toggle */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "installment", label: "تقسيط", icon: Calendar },
              { value: "full", label: "كاش كامل", icon: Wallet },
            ].map((opt) => {
              const Icon = opt.icon;
              const active = installmentType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setInstallmentType(opt.value as "full" | "installment")}
                  className={`relative flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all duration-200 ${
                    active
                      ? "border-[#1a6b7d] bg-gradient-to-br from-[#1a6b7d]/8 to-[#1a6b7d]/3 shadow-md"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  {active && (
                    <span className="absolute top-2 left-2">
                      <CheckCircle2 size={13} className="text-[#1a6b7d]" />
                    </span>
                  )}
                  <Icon size={17} className={active ? "text-[#1a6b7d]" : "text-gray-400"} />
                  <p className={`text-sm font-bold ${active ? "text-[#1a6b7d]" : "text-gray-700"}`}>{opt.label}</p>
                </button>
              );
            })}
          </div>

          {/* ── Installment options ── */}
          <AnimatePresence>
            {installmentType === "installment" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-5 pt-1">

                  {/* Provider selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600">اختر جهة التقسيط</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["tabby", "tamara", "store"] as const).map((p) => {
                        const active = installmentProvider === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setInstallmentProvider(p)}
                            className={`relative flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl border-2 transition-all duration-200 bg-white ${
                              active
                                ? "border-[#1a6b7d] bg-[#1a6b7d]/5 shadow-md"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            {active && (
                              <span className="absolute top-2 left-2">
                                <CheckCircle2 size={15} className="text-[#1a6b7d]" />
                              </span>
                            )}
                            <Image
                              src={p === "tabby" ? "/Tabby-01.png" : p === "tamara" ? "/tamara.png" : "/logo.webp"}
                              alt={p === "store" ? "نظام المتجر" : p}
                              width={90}
                              height={32}
                              className="object-contain w-[80%] max-h-8"
                            />
                            {p === "store" && (
                              <span className="text-[10px] font-bold text-[#1a6b7d]">نظام المتجر</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Months */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#1a6b7d]" />
                      عدد أشهر التقسيط
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {MONTHS_OPTIONS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMonths(m)}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-150 border-2 ${
                            months === m
                              ? "border-[#1a6b7d] bg-[#1a6b7d] text-white shadow-md shadow-[#1a6b7d]/25"
                              : "border-gray-200 text-gray-600 hover:border-[#1a6b7d]/40 hover:text-[#1a6b7d] bg-white"
                          }`}
                        >
                          {m}
                          <span className="block text-[9px] font-medium opacity-70 mt-0.5">شهر</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Down payment */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                      <Wallet size={12} className="text-[#1a6b7d]" />
                      الدفعة الأولى
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {DOWN_OPTIONS.map((opt) => (
                        <button
                          key={opt.amount}
                          type="button"
                          onClick={() => setDownPayment(opt.amount)}
                          className={`relative py-3 px-2 rounded-xl border-2 text-center transition-all duration-150 ${
                            downPayment === opt.amount
                              ? "border-[#7CC043] bg-[#7CC043]/8 shadow-sm"
                              : "border-gray-200 hover:border-[#7CC043]/40 bg-white"
                          }`}
                        >
                          {downPayment === opt.amount && (
                            <span className="absolute top-1.5 left-1.5">
                              <CheckCircle2 size={12} className="text-[#7CC043]" />
                            </span>
                          )}
                          <p className={`text-xs font-extrabold ${downPayment === opt.amount ? "text-[#3b6a00]" : "text-gray-700"}`}>
                            {opt.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly summary */}
                  <div className="bg-gradient-to-r from-[#1a6b7d]/8 to-[#7CC043]/8 border border-[#1a6b7d]/15 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">القسط الشهري</p>
                      <p className="text-2xl font-extrabold text-[#1a6b7d] mt-0.5">
                        {fmt(monthly)} <span className="text-sm font-semibold text-gray-400">ر.س</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">لمدة</p>
                      <p className="text-lg font-extrabold text-[#7CC043]">
                        {months} <span className="text-sm font-semibold text-gray-400">شهر</span>
                      </p>
                    </div>
                  </div>

                  {/* Schedule toggle */}
                  <button
                    type="button"
                    onClick={() => setShowSchedule(!showSchedule)}
                    className="w-full flex items-center justify-between text-xs text-[#1a6b7d] font-semibold bg-[#1a6b7d]/5 hover:bg-[#1a6b7d]/10 transition rounded-xl px-4 py-2.5"
                  >
                    <span>عرض جدول الأقساط التفصيلي</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showSchedule ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showSchedule && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl overflow-hidden border border-gray-100 max-h-52 overflow-y-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-[#1a6b7d] sticky top-0">
                              <tr>
                                <th className="py-2.5 px-3 text-right font-semibold text-white/80">#</th>
                                <th className="py-2.5 px-3 text-right font-semibold text-white/80">التاريخ</th>
                                <th className="py-2.5 px-3 text-right font-semibold text-white/80">المبلغ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {schedule.map((row, i) => (
                                <tr key={row.index} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                  <td className="py-2 px-3 text-[#1a6b7d] font-bold">{row.index}</td>
                                  <td className="py-2 px-3 text-gray-500">{row.date}</td>
                                  <td className="py-2 px-3 font-bold text-gray-800">{fmt(row.amount)} ر.س</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Cash: Discount code ── */}
          <AnimatePresence>
            {installmentType === "full" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <Tag size={12} className="text-[#1a6b7d]" />
                    كود الخصم (اختياري)
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value.toUpperCase());
                        setDiscountApplied(false);
                        setDiscountError("");
                      }}
                      placeholder=""
                      dir="ltr"
                      className={`flex-1 bg-gray-50 border rounded-xl px-4 py-3 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1a6b7d]/25 focus:border-[#1a6b7d] transition-all ${
                        discountApplied ? "border-green-400 bg-green-50 text-green-700" : discountError ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={applyDiscount}
                      disabled={discountApplied}
                      className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        discountApplied
                          ? "bg-green-500 text-white cursor-default"
                          : "bg-[#1a6b7d] text-white hover:bg-[#155e6f] active:scale-95"
                      }`}
                    >
                      {discountApplied ? "✓ مطبّق" : "تطبيق"}
                    </button>
                  </div>
                  {discountError && <p className="text-red-400 text-xs">{discountError}</p>}
                  {discountApplied && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5"
                    >
                      <span className="text-green-700 text-xs font-semibold">🎉 تم تطبيق الخصم</span>
                      <span className="text-green-700 text-sm font-extrabold">- {DISCOUNT_VALUE} ر.س</span>
                    </motion.div>
                  )}
                  {discountApplied && (
                    <div className="flex items-center justify-between bg-[#1a6b7d]/5 rounded-xl px-4 py-2.5">
                      <span className="text-gray-600 text-xs font-semibold">الإجمالي بعد الخصم</span>
                      <span className="text-[#1a6b7d] text-base font-extrabold">{fmt(finalTotal)} ر.س</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-gradient-to-bl from-[#1a6b7d] to-[#155e6f] text-white rounded-xl font-extrabold text-base shadow-lg shadow-[#1a6b7d]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        إتمام الطلب ←
      </button>
    </div>
  );
}
