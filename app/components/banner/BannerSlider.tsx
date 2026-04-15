"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const AUTO_PLAY_MS = 4000;
const SWIPE_THRESHOLD = 50;

export default function BannerSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((i: number) => {
    setCurrent((i + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    intervalRef.current = setInterval(() => setCurrent(c => (c + 1) % images.length), AUTO_PLAY_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [images.length]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) goTo(current + (diff > 0 ? 1 : -1));
  };

  return (
    <section className="w-full flex justify-center py-6 px-4" style={{ background: "linear-gradient(180deg, #e8f5f7 0%, #ffffff 100%)" }}>
      <div className="relative w-full max-w-7xl overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${current * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {images.map((src, i) => (
            <div key={i} className="min-w-full relative aspect-[1.8/1]">
              <Image src={src} alt={`banner ${i + 1}`} fill className="object-contain" priority={i === 0} unoptimized />
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
