"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AUTO_PLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function BannerSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const touchStart = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const total = images.length;

  const goTo = useCallback(
    (i: number, dir?: number) => {
      const next = (i + total) % total;
      setDirection(dir ?? (next > current ? 1 : -1));
      setCurrent(next);
      setProgress(0);
    },
    [total, current]
  );

  // Auto-play + progress
  useEffect(() => {
    setProgress(0);
    const step = 30;
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + step / AUTO_PLAY_MS, 1));
    }, step);
    intervalRef.current = setTimeout(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % total);
      setProgress(0);
    }, AUTO_PLAY_MS);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) goTo(current + (diff > 0 ? 1 : -1), diff > 0 ? 1 : -1);
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, scale: 1.08, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, scale: 0.95, x: d > 0 ? -60 : 60 }),
  };

  return (
    <section className="relative w-full overflow-hidden" dir="rtl">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a2e38] via-[#0f3d4a] to-[#155E6F]" />

      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#1F7A8C]/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#6DBE00]/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-white/5 blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
        {/* Decorative lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 lg:py-10">
        <div className="relative">
          {/* Image container */}
          <div
            className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/30 bg-black/10 backdrop-blur-sm border border-white/10"
            style={{ aspectRatio: "2/1" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/10 z-10 pointer-events-none" />

            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={images[current]}
                  alt={`بانر ${current + 1}`}
                  fill
                  className="object-contain"
                  priority={current === 0}
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-[5]" />

            {/* Navigation arrows */}
            {total > 1 && (
              <>
                <button
                  onClick={() => goTo(current + 1, 1)}
                  aria-label="التالي"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => goTo(current - 1, -1)}
                  aria-label="السابق"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Bottom controls */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`الانتقال للشريحة ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                  className="relative group"
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === current
                        ? "w-10 sm:w-14 bg-white/30"
                        : "w-3 sm:w-4 bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    {i === current && (
                      <motion.div
                        className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-[#6DBE00] to-[#4fa800]"
                        style={{ width: `${progress * 100}%` }}
                        transition={{ duration: 0.03, ease: "linear" }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
