"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { IoChevronBack, IoChevronForward, IoExpand } from "react-icons/io5";

interface ProductImagesProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductImages({ images, name, discountPercent = 0 }: ProductImagesProps) {
  const [sel, setSel] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchX = useRef(0);

  const go = (d: number) => setSel((s) => (s + d + images.length) % images.length);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image */}
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-lg shadow-black/[.06] group"
        style={{ aspectRatio: "1/1" }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const d = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) go(d > 0 ? 1 : -1);
        }}
      >
        {/* Badges */}
        <div className="absolute z-10 top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2">
          {discountPercent > 0 && (
            <div className="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-lg shadow-red-600/30 text-center">
              خصم {discountPercent}%
            </div>
          )}
        </div>

        {/* Zoom toggle */}
        <button onClick={() => setZoomed(!zoomed)} className="absolute z-10 top-3 left-3 sm:top-4 sm:left-4 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/5 backdrop-blur-sm flex items-center justify-center text-gray-500 hover:bg-black/10 transition">
          <IoExpand size={16} />
        </button>

        {/* Image */}
        {images.length > 0 ? (
          <div className={`w-full h-full transition-transform duration-500 ${zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`} onClick={() => setZoomed(!zoomed)}>
            <Image
              src={images[sel]}
              alt={name}
              fill
              className="object-contain p-8 sm:p-12"
              priority
              sizes="(max-width:1024px) 100vw, 58vw"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">📱</div>
        )}

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button onClick={() => go(1)} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
              <IoChevronBack size={18} />
            </button>
            <button onClick={() => go(-1)} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
              <IoChevronForward size={18} />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setSel(i)} className={`rounded-full transition-all duration-300 ${i === sel ? "w-6 h-2 bg-[#1F7A8C]" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"}`} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-3 justify-center px-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSel(i)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
                i === sel
                  ? "ring-2 ring-[#1F7A8C] ring-offset-2 shadow-lg scale-105"
                  : "border border-gray-200 opacity-50 hover:opacity-100 hover:border-[#1F7A8C]/30"
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
