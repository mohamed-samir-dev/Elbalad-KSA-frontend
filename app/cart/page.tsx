"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoCartOutline, IoChevronBack } from "react-icons/io5";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;
  const installmentMonths = mounted ? Math.max(...items.map((i) => i.product.installment?.months ?? 0)) || undefined : undefined;

  if (!mounted) return null;

  if (items.length === 0)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 bg-white" dir="rtl">
        <div className="w-20 h-20 bg-[#1F6F8B]/40 rounded-full flex items-center justify-center">
          <IoCartOutline size={36} className="text-[#B8D8EC]" />
        </div>
        <div className="text-center">
          <p className="text-white text-lg font-bold">السلة فارغة</p>
          <p className="text-[#B8D8EC] text-sm mt-1">لم تضف أي منتجات بعد</p>
        </div>
        <button onClick={() => router.push("/")} className="bg-gradient-to-bl from-[#1a6b7d] to-[#155e6f] hover:opacity-90 text-white px-8 py-3 rounded-full font-bold text-sm transition shadow-lg shadow-[#1a6b7d]/30">
          تصفح المنتجات
        </button>
      </main>
    );

  return (
    <main className="min-h-screen pb-24 bg-[#f8f9fa]" dir="rtl">
      <style>{`body { background-color: #f8f9fa; }`}</style>
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 bg-[#0F4C6E]/20 rounded-full flex items-center justify-center hover:bg-[#0F4C6E]/40 transition">
              <IoChevronBack size={18} className="text-[#0F4C6E] rotate-180" />
            </Link>
            <div>
              <h1 className="text-base font-extrabold text-[#0F4C6E]">سلة التسوق</h1>
              <p className="text-xs text-[#0F4C6E]/70">{count} منتج</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 pt-4 space-y-3">
        {items.map(({ product, qty }) => (
          <CartItem
            key={product._id}
            product={product}
            qty={qty}
            onUpdateQty={updateQty}
            onRemove={removeItem}
          />
        ))}

        <div className="bg-gray-800 rounded-2xl p-3 sm:p-4 space-y-2.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#B8D8EC]">المجموع</span>
            <span className="text-white font-bold">{fmt(total)} ر.س</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#B8D8EC]">التوصيل</span>
            <span className="text-[#7CC043] font-bold text-xs">مجاني</span>
          </div>
          <div className="border-t border-[#1F6F8B] pt-2.5 flex justify-between items-center">
            <span className="text-white font-bold text-sm">الإجمالي</span>
            <span className="text-white text-lg font-extrabold">{fmt(total)} <span className="text-xs font-medium text-[#B8D8EC]">ر.س</span></span>
          </div>
        </div>

        <CustomerForm
          total={total}
          itemCount={count}
          initialData={customer}
          installmentMonths={installmentMonths}
          onSubmit={(info: CustomerInfo) => {
            setCustomer(info);
            router.push("/checkout");
          }}
        />
      </div>
    </main>
  );
}
