"use client";

import { useState, useMemo } from "react";
import { IoPersonOutline, IoLocationOutline, IoCardOutline } from "react-icons/io5";
import type { CustomerInfo } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

interface CustomerFormProps {
  total: number;
  itemCount: number;
  initialData?: CustomerInfo | null;
  installmentMonths?: number;
  onSubmit: (info: CustomerInfo) => void;
}

export default function CustomerForm({ total, itemCount, initialData, installmentMonths, onSubmit }: CustomerFormProps) {
  const MONTHS_OPTIONS = Array.from({ length: installmentMonths ?? 24 }, (_, i) => i + 1);
  const minDownPayment = 500 * itemCount;
  const DOWN_PAYMENT_OPTIONS = [minDownPayment, minDownPayment + 500, minDownPayment + 1000];
  const [name, setName] = useState(initialData?.name ?? "");
  const [nationalId, setNationalId] = useState(initialData?.nationalId ?? "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [installmentType, setInstallmentType] = useState<"full" | "installment">(initialData?.installmentType ?? "installment");
  const [months, setMonths] = useState(initialData?.months ?? 24);
  const [downPaymentExtra, setDownPaymentExtra] = useState<number>(0);
  const downPayment = minDownPayment + downPaymentExtra;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const monthlyPayment = useMemo(() => {
    if (installmentType === "full") return 0;
    const remaining = total - downPayment;
    return remaining > 0 ? Math.ceil(remaining / months) : 0;
  }, [total, months, installmentType, downPayment]);

  const schedule = useMemo(() => {
    const now = new Date();
    return Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i + 1, now.getDate());
      return {
        index: i + 1,
        date: `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`,
        amount: monthlyPayment,
      };
    });
  }, [months, monthlyPayment]);

  const inputBase = "w-full bg-[#f3f4f6] border-none rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3b6a00] focus:bg-white transition-all duration-200 placeholder:text-gray-400";
  const inputError = "w-full bg-[#f3f4f6] border-2 border-red-400 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400";

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "مطلوب";
    if (!nationalId.trim()) newErrors.nationalId = "مطلوب";
    else if (!/^[12]\d{9}$/.test(nationalId.trim())) newErrors.nationalId = "يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام";
    if (!whatsapp.trim()) newErrors.whatsapp = "مطلوب";
    else if (!/^05\d{8}$/.test(whatsapp.trim())) newErrors.whatsapp = "رقم غير صحيح، يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!address.trim()) newErrors.address = "مطلوب";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ name, nationalId, whatsapp, address, installmentType, months, downPayment });
    }
  };

  return (
    <div className="space-y-4">
      {/* معلومات العميل */}
      <section className="bg-white rounded-xl p-5 sm:p-7 shadow-[0_12px_32px_-4px_rgba(25,28,29,0.04)]">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-[#0F4C6E]">
          <IoPersonOutline className="text-[#3b6a00] text-xl" />
          معلومات العميل
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">الاسم كاملاً <span className="text-red-400">*</span></label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value.replace(/[0-9]/g, "")); setErrors((p) => ({ ...p, name: "" })); }}
              placeholder="أدخل اسمك بالكامل"
              className={errors.name ? inputError : inputBase}
            />
            {errors.name && <p className="text-red-400 text-xs font-bold">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">رقم الهوية / الإقامة <span className="text-red-400">*</span></label>
            <input
              value={nationalId}
              onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 10); setNationalId(v); setErrors((p) => ({ ...p, nationalId: "" })); }}
              placeholder="رقم الهوية / الإقامة"
              dir="ltr"
              className={errors.nationalId ? inputError : inputBase}
            />
            {errors.nationalId && <p className="text-red-400 text-xs font-bold">{errors.nationalId}</p>}
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-gray-500">رقم الواتساب <span className="text-red-400">*</span></label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10); setWhatsapp(val); setErrors((p) => ({ ...p, whatsapp: "" })); }}
              placeholder="05XXXXXXXX"
              dir="ltr"
              className={errors.whatsapp ? inputError : inputBase}
            />
            {errors.whatsapp && <p className="text-red-400 text-xs font-bold">{errors.whatsapp}</p>}
          </div>
        </div>
      </section>

      {/* العنوان */}
      <section className="bg-white rounded-xl p-5 sm:p-7 shadow-[0_12px_32px_-4px_rgba(25,28,29,0.04)]">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-[#0F4C6E]">
          <IoLocationOutline className="text-[#3b6a00] text-xl" />
          تفاصيل الشحن
        </h2>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-500">العنوان بالتفصيل <span className="text-red-400">*</span></label>
          <input
            value={address}
            onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
            placeholder="المدينة - الحي - الشارع"
            className={errors.address ? inputError : inputBase}
          />
          {errors.address && <p className="text-red-400 text-xs font-bold">{errors.address}</p>}
        </div>
      </section>

      {/* طريقة الدفع */}
      <section className="bg-white rounded-xl p-5 sm:p-7 shadow-[0_12px_32px_-4px_rgba(25,28,29,0.04)]">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-[#0F4C6E]">
          <IoCardOutline className="text-[#3b6a00] text-xl" />
          طريقة الدفع
        </h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">الدفع / التقسيط على <span className="text-red-400">*</span></label>
            <select
              value={installmentType === "full" ? "full" : String(months)}
              onChange={(e) => {
                if (e.target.value === "full") {
                  setInstallmentType("full");
                } else {
                  setInstallmentType("installment");
                  setMonths(Number(e.target.value));
                }
              }}
              className="w-full bg-[#f3f4f6] border-none rounded-lg p-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3b6a00] focus:bg-white transition-all duration-200 cursor-pointer"
            >
              <option value="full">سداد المبلغ كاملاً</option>
              {MONTHS_OPTIONS.map((m) => (
                <option key={m} value={m}>تقسيط {m} شهر</option>
              ))}
            </select>
          </div>

          {installmentType === "installment" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-500">الدفعة الأولى</label>
                  <select
                    value={String(downPaymentExtra)}
                    onChange={(e) => setDownPaymentExtra(Number(e.target.value))}
                    className="w-full bg-[#f3f4f6] border-none rounded-lg p-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3b6a00] focus:bg-white transition-all duration-200 cursor-pointer"
                  >
                    {DOWN_PAYMENT_OPTIONS.map((v) => (
                      <option key={v} value={v - minDownPayment}>{fmt(v)} ر.س</option>
                    ))}
                    <option value={total - minDownPayment}>الدفع بالكامل ({fmt(total)} ر.س)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-500">القسط الشهري</label>
                  <div className="w-full bg-[#3b6a00]/5 border-2 border-[#3b6a00]/20 rounded-lg p-3 text-sm font-extrabold text-[#3b6a00]">
                    {fmt(monthlyPayment)} ر.س
                  </div>
                </div>
              </div>

              {months > 0 && (
                <div className="rounded-xl overflow-hidden border border-gray-100 mt-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#f3f4f6]">
                        <th className="py-2.5 px-3 text-right text-xs font-bold text-gray-500">#</th>
                        <th className="py-2.5 px-3 text-right text-xs font-bold text-gray-500">التاريخ</th>
                        <th className="py-2.5 px-3 text-right text-xs font-bold text-gray-500">المبلغ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((row, i) => (
                        <tr key={row.index} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                          <td className="py-2 px-3 text-gray-400 font-bold text-xs">{row.index}</td>
                          <td className="py-2 px-3 text-gray-600 text-xs">{row.date}</td>
                          <td className="py-2 px-3 font-bold text-gray-800 text-xs">{fmt(row.amount)} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-gradient-to-bl from-[#1a6b7d] to-[#155e6f] text-white rounded-xl font-extrabold text-base shadow-xl shadow-[#1a6b7d]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      >
        إتمام الطلب
      </button>
    </div>
  );
}
