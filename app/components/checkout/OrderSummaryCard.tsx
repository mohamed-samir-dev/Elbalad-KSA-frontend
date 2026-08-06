import { ShoppingBag, Truck, Tag, Receipt } from "lucide-react";

const fmt = (n: number) => n.toLocaleString("en-US");

interface OrderSummaryCardProps {
  total: number;
  itemCount: number;
  downPayment?: number;
  cta?: React.ReactNode;
}

export default function OrderSummaryCard({ total, itemCount, downPayment, cta }: OrderSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f3d4a] to-[#1a6b7d] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
            <Receipt size={15} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-white">ملخص الطلب</h3>
        </div>
      </div>

      {/* Rows */}
      <div className="px-5 py-4 space-y-0 divide-y divide-gray-50">
        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <ShoppingBag size={13} className="text-gray-400" />
            المنتجات ({itemCount})
          </span>
          <span className="text-sm font-semibold text-gray-800">{fmt(total)} ر.س</span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <Truck size={13} className="text-gray-400" />
            الشحن
          </span>
          <span className="text-xs font-bold text-[#7CC043] bg-[#7CC043]/10 px-2 py-0.5 rounded-full">مجاني</span>
        </div>

        {downPayment != null && downPayment > 0 && (
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <Tag size={13} className="text-gray-400" />
              الدفعة الأولى
            </span>
            <span className="text-sm font-semibold text-gray-800">{fmt(downPayment)} ر.س</span>
          </div>
        )}

        {/* Total */}
        <div className="pt-4 pb-1">
          <div className="bg-gradient-to-r from-[#1a6b7d]/6 to-[#7CC043]/6 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">الإجمالي</span>
            <div className="text-right">
              <span className="text-xl font-extrabold text-[#1a6b7d]">{fmt(total)}</span>
              <span className="text-xs font-medium text-gray-400 mr-1">ر.س</span>
            </div>
          </div>
        </div>
      </div>

      {cta && <div className="px-5 pb-5">{cta}</div>}
    </div>
  );
}
