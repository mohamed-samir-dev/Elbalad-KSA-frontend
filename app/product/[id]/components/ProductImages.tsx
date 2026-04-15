"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImagesProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductImages({ images, name, discountPercent = 0 }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#f0f9fa] via-white to-[#e8f4f0]">
        {discountPercent > 0 && (
          <div className="absolute z-10 top-3 right-3 sm:top-4 sm:right-4">
            <div className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg shadow-red-600/30">
              {discountPercent}%- خصم
            </div>
          </div>
        )}
        {images.length > 0 ? (
          <Image
            src={images[selectedImage]}
            alt={name}
            fill
            className="object-contain p-6 sm:p-10 transition-transform duration-500 hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl sm:text-7xl">📱</div>
        )}
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-1 rounded-md">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-2.5 justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden transition-all duration-300 ${
                i === selectedImage
                  ? "ring-2 ring-[#1F7A8C] ring-offset-2 shadow-md scale-105"
                  : "border border-gray-200 hover:border-[#1F7A8C]/40 opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
