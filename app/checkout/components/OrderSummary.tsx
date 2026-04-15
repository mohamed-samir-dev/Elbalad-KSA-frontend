import { IoReceiptOutline } from "react-icons/io5";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function OrderSummary({ total, downPayment }: { total: number; downPayment: number }) {
  return (
    <section className="bg-white rounded-xl p-5 sm:p-7 shadow-[0_12px_32px_-4px_rgba(25,28,29,0.04)]">
      <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-[#0F4C6E]">
        <IoReceiptOutline className="text-[#3b6a00] text-xl" />
        ملخص الطلب
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">مجموع السلة</span>
          <span className="font-bold text-gray-800">{fmt(total)} ر.س</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">التوصيل</span>
          <span className="text-[#3b6a00] font-bold text-xs">مجاني</span>
        </div>
        {downPayment > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">الدفعة الأولى</span>
            <span className="font-bold text-gray-800">{fmt(downPayment)} ر.س</span>
          </div>
        )}
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="text-[#0F4C6E] font-bold text-sm">الإجمالي</span>
          <span className="text-[#3b6a00] text-lg font-extrabold">{fmt(total)} <span className="text-xs font-medium text-gray-400">ر.س</span></span>
        </div>
      </div>
    </section>
  );
}
