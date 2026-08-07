"use client";

import { useState, useRef } from "react";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CustomerInfo } from "../../store/cartStore";

interface Props {
  initialData?: Partial<CustomerInfo>;
  onNext: (info: Partial<CustomerInfo>) => void;
}

const inputBase =
  "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a6b7d]/30 focus:border-[#1a6b7d] focus:bg-white transition-all placeholder:text-gray-400";
const inputErr =
  "w-full bg-red-50 border-2 border-red-400 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:bg-white transition-all placeholder:text-gray-400";

export default function CustomerInfoForm({ initialData, onNext }: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [nationalId, setNationalId] = useState(initialData?.nationalId ?? "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLDivElement>(null);
  const nationalIdRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "الاسم مطلوب";
    if (!nationalId.trim()) e.nationalId = "رقم الهوية مطلوب";
    else if (!/^[12]\d{9}$/.test(nationalId.trim())) e.nationalId = "يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام";
    if (!whatsapp.trim()) e.whatsapp = "رقم الواتساب مطلوب";
    else if (!/^05\d{8}$/.test(whatsapp.trim())) e.whatsapp = "يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!address.trim()) e.address = "العنوان مطلوب";
    setErrors(e);

    if (e.name) { scrollTo(nameRef); return false; }
    if (e.nationalId) { scrollTo(nationalIdRef); return false; }
    if (e.whatsapp) { scrollTo(whatsappRef); return false; }
    if (e.address) { scrollTo(addressRef); return false; }
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext({ name, nationalId, whatsapp, address });
  };

  return (
    <div className="space-y-4">
      {/* Customer Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1a6b7d]/10 rounded-lg flex items-center justify-center">
            <User size={15} className="text-[#1a6b7d]" />
          </div>
          <h2 className="text-sm font-bold text-gray-800">معلومات العميل</h2>
        </div>
        <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div ref={nameRef} className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">الاسم كاملاً <span className="text-red-400">*</span></label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value.replace(/[0-9]/g, "")); setErrors(p => ({ ...p, name: "" })); }}
              placeholder="أدخل اسمك بالكامل"
              className={errors.name ? inputErr : inputBase}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div ref={nationalIdRef} className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">رقم الهوية / الإقامة <span className="text-red-400">*</span></label>
            <input
              value={nationalId}
              onChange={(e) => { setNationalId(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, nationalId: "" })); }}
              placeholder="رقم الهوية"
              dir="ltr"
              className={errors.nationalId ? inputErr : inputBase}
            />
            <AnimatePresence>
              {errors.nationalId && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.nationalId}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div ref={whatsappRef} className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">رقم الواتساب <span className="text-red-400">*</span></label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => { setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, whatsapp: "" })); }}
              placeholder="05XXXXXXXX"
              dir="ltr"
              className={errors.whatsapp ? inputErr : inputBase}
            />
            <AnimatePresence>
              {errors.whatsapp && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.whatsapp}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div ref={addressRef} className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">عنوان التوصيل <span className="text-red-400">*</span></label>
            <input
              value={address}
              onChange={(e) => { setAddress(e.target.value); setErrors(p => ({ ...p, address: "" })); }}
              placeholder="المدينة - الحي - الشارع"
              className={errors.address ? inputErr : inputBase}
            />
            <AnimatePresence>
              {errors.address && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs flex items-center gap-1">
                  <span>⚠</span> {errors.address}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full py-4 bg-gradient-to-bl from-[#1a6b7d] to-[#155e6f] text-white rounded-xl font-extrabold text-base shadow-lg shadow-[#1a6b7d]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        التالي — اختيار طريقة الدفع ←
      </button>
    </div>
  );
}
