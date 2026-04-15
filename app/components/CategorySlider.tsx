"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

type Category = { name: string; count: number; image: string; href: string };

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 5);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => { checkScroll(); }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 250, behavior: "smooth" });
  };

  return (
    <div ref={sectionRef} className="relative w-full" dir="rtl">
      {showRight && (
        <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#155E6F] hover:bg-[#155E6F] hover:text-white transition-colors" aria-label="التالي">
          ‹
        </button>
      )}
      {showLeft && (
        <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#155E6F] hover:bg-[#155E6F] hover:text-white transition-colors" aria-label="السابق">
          ›
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-1 py-2"
      >
        {categories.map((cat, i) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="shrink-0 w-[110px] sm:w-[130px]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(40px)",
              transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`,
            }}
          >
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-[#f0faf5] to-white p-3 sm:p-4 flex flex-col items-center gap-2 hover:border-[#6DBE00] hover:shadow-lg transition-all duration-200">
              <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-xl bg-white shadow-sm relative overflow-hidden border border-gray-50">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-contain p-1.5"
                    sizes="72px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                )}
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-[#155E6F] text-center leading-tight line-clamp-2 w-full">
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
