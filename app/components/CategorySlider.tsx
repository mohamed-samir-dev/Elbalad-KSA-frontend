"use client";
import Image from "next/image";
import Link from "next/link";

type Category = { name: string; count: number; image: string; href: string };

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const items = [...categories, ...categories];

  return (
    <div className="w-full overflow-hidden relative" dir="ltr" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 60s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-track">
        {items.map((cat, i) => (
          <Link
            key={`${cat.name}-${i}`}
            href={cat.href}
            className="shrink-0 group mx-2 w-[110px] sm:w-[130px]"
          >
            <div className="relative rounded-2xl border border-gray-100 bg-gradient-to-b from-[#f0faf5] to-white p-3 sm:p-4 flex flex-col items-center gap-2 hover:border-[#6DBE00] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[3px] rounded-t-2xl bg-gradient-to-r from-[#6DBE00] to-[#155E6F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
              <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-xl bg-white shadow-sm relative overflow-hidden border border-gray-50">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                    sizes="72px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                )}
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-[#155E6F] text-center leading-tight line-clamp-2 group-hover:text-[#1F7A8C] transition-colors w-full" dir="rtl">
                {cat.name}
              </p>
              {cat.count > 0 && (
                <span className="text-[10px] text-white bg-[#6DBE00] rounded-full px-2 py-[1px] font-medium">
                  {cat.count} منتج
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
