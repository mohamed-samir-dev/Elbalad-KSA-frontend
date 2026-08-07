"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import CartItemCard from "../components/checkout/CartItemCard";
import OrderSummaryCard from "../components/checkout/OrderSummaryCard";
import TrustBadges from "../components/checkout/TrustBadges";
import CustomerInfoForm from "./components/CustomerInfoForm";
import PaymentForm from "./components/PaymentForm";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [customerDraft, setCustomerDraft] = useState<Partial<CustomerInfo>>(customer ?? {});

  useEffect(() => { setMounted(true); }, []);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;
  const installmentMonths = mounted
    ? Math.max(...items.map((i) => i.product.installment?.months ?? 0)) || undefined
    : undefined;

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f9fa]" dir="rtl">
        <CheckoutStepper currentStep={1} />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-[#1a6b7d]/10 rounded-full flex items-center justify-center"
          >
            <ShoppingCart size={40} className="text-[#1a6b7d]" />
          </motion.div>
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-center"
          >
            <h2 className="text-xl font-extrabold text-gray-800">السلة فارغة</h2>
            <p className="text-gray-500 text-sm mt-1">لم تضف أي منتجات بعد</p>
          </motion.div>
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-bl from-[#1a6b7d] to-[#155e6f] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#1a6b7d]/25 hover:scale-[1.02] transition-transform"
            >
              <ArrowLeft size={16} />
              تصفح المنتجات
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa]" dir="rtl">
      <style>{`body { background-color: #f8f9fa; }`}</style>
      <CheckoutStepper currentStep={step === 1 ? 1 : 2} />

      {/* Page header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#1a6b7d] transition-colors">الرئيسية</Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-800 font-semibold">سلة التسوق</span>
          <span className="mr-auto bg-[#1a6b7d]/10 text-[#1a6b7d] text-xs font-bold px-2.5 py-1 rounded-full">
            {count} منتج
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <AnimatePresence>
                    {items.map(({ product, qty }) => (
                      <CartItemCard
                        key={product._id}
                        product={product}
                        qty={qty}
                        onUpdateQty={updateQty}
                        onRemove={removeItem}
                      />
                    ))}
                  </AnimatePresence>

                  <CustomerInfoForm
                    initialData={customerDraft}
                    onNext={(info) => {
                      setCustomerDraft(info);
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <PaymentForm
                    total={total}
                    itemCount={count}
                    initialData={customerDraft}
                    installmentMonths={installmentMonths}
                    onBack={() => {
                      setStep(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onSubmit={(info: CustomerInfo) => {
                      setCustomer(info);
                      router.push("/checkout");
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT — Sticky order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-3">
              <OrderSummaryCard
                total={total}
                itemCount={count}
                cta={
                  <div className="space-y-3">
                    <div className="text-xs text-gray-400 text-center">
                      {step === 1 ? "أكمل بيانات الشحن ثم اضغط التالي" : "اختر طريقة الدفع وأتمم الطلب"}
                    </div>
                    <TrustBadges />
                  </div>
                }
              />
              <div className="bg-[#7CC043]/10 border border-[#7CC043]/30 rounded-xl px-4 py-3 text-center">
                <p className="text-xs font-semibold text-[#3b6a00]">🚚 شحن مجاني على جميع الطلبات</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
