import { ShieldCheck, RotateCcw, Truck, Lock } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "دفع آمن 100%" },
  { icon: RotateCcw, label: "إرجاع مجاني" },
  { icon: Truck, label: "شحن مجاني" },
  { icon: Lock, label: "بيانات مشفّرة" },
];

export default function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-1.5 text-gray-500">
          <Icon size={13} className="text-[#7CC043] shrink-0" />
          <span className="text-[11px] font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
