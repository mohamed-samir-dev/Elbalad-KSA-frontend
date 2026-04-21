"use client";
import { useEffect, useState, useMemo, memo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "./types";
import CategoryBanner from "../banner/CategoryBanner";

const LIMIT = 4;

// map category value → page path for "عرض الكل" link
const categoryPageMap: Record<string, string> = {
  // English keys
  smartphone: "/smartphones/apple-only",
  smartphones: "/smartphones/apple-only",
  watch: "/apple-watches/se",
  audio: "/audio/airpods-pro",
  speaker: "/audio/airpods-max",
  earbuds: "/audio/samsung-buds",
  ps5: "/playstation/ps5",
  ps4: "/playstation/ps5-slim",
  xbox: "/playstation/xbox-one",
  controller: "/playstation/controllers",
  "gaming-accessories": "/playstation/ps-accessories",
  laptop: "/laptops/macbook-pro",
  monitor: "/laptops/samsung-monitors",
  tablet: "/tablets/ipad-pro",
  powerbank: "/accessories/anker-batteries",
  gaming: "/games/ps5-games",
  "mice-keyboards": "/games/mice-keyboards",
  microphone: "/games/microphones",
  figures: "/games/figures",
  rgb: "/games/rgb-lighting",
  // Arabic category names from products
  "ابل ايفون 17 برو": "/smartphones/iphone-17-pro",
  "ابل ايفون 17 برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17": "/smartphones/iphone-17",
  "ابل ايفون 17 اير": "/smartphones/iphone-17-air",
  "ابل ايفون 16 برو": "/smartphones/iphone-16-pro",
  "ابل ايفون 16 برو ماكس": "/smartphones/iphone-16-pro-max",
  "ابل ايفون 16": "/smartphones/iphone-16",
  "ابل ايفون 16 بلس": "/smartphones/iphone-16-plus",
  "ابل ايفون 15 برو": "/smartphones/iphone-15-pro",
  "ابل ايفون 15 برو ماكس": "/smartphones/iphone-15-pro-max",
  "ابل ايفون 15": "/smartphones/iphone-15",
  "ابل ايفون 15 بلس": "/smartphones/iphone-15-plus",
  "ابل ايفون 14 برو": "/smartphones/iphone-14-pro",
  "ابل ايفون 14 برو ماكس": "/smartphones/iphone-14-pro-max",
  "ابل ايفون 14": "/smartphones/iphone-14",
  "ابل ايفون 14 بلس": "/smartphones/iphone-14-plus",
  "ابل ايفون 13 برو ماكس": "/smartphones/iphone-13-pro-max",
  "سامسونج جالكسي": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي S26": "/smartphones/samsung-s26-ultra",
  "سامسونج جالاكسي S26 الترا": "/smartphones/samsung-s26-ultra",
  "سامسونج جالاكسي اس 26 الترا": "/smartphones/samsung-s26-ultra",
  "سامسونج جالاكسي S25": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي S25 الترا": "/smartphones/samsung-s25-ultra",
  "ساعات ابل": "/apple-watches/se",
  "سماعات ابل": "/audio/airpods-pro",
  "بلاي ستيشن": "/playstation/ps5",
  "لابتوبات": "/laptops/macbook-pro",
  "ايبادات": "/tablets/ipad-pro",
  "ملحقات": "/accessories/anker-batteries",
  "العاب": "/games/ps5-games",
};

const CategoryRow = memo(function CategoryRow({ category, items, isFirst }: { category: string; items: Product[]; isFirst?: boolean }) {
  const visible = items.slice(0, LIMIT);
  const href = categoryPageMap[category] ?? categoryPageMap[category.toLowerCase()] ?? `/search?q=${encodeURIComponent(category)}`;

  return (
    <div className="mb-8 sm:mb-12">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-5 sm:mb-7" dir="rtl">
        <div className="w-1 sm:w-1.5 h-6 sm:h-8 rounded-full bg-gradient-to-b from-[#1F7A8C] to-[#155E6F]" />
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-800 whitespace-nowrap">{category}</h2>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent" />
        <Link
          href={href}
          className="text-[10px] sm:text-xs font-semibold text-[#1F7A8C] hover:text-white whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#1F7A8C]/40 hover:bg-[#1F7A8C] transition-all duration-300"
        >
          عرض الكل ←
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {visible.map((p, i) => (
          <ProductCard key={p._id} product={p} priority={isFirst && i === 0} />
        ))}
      </div>
    </div>
  );
});

type HomeSettings = { category: string; subCategory: string; showInHome: boolean; order: number };
type HomeConfig = { settings: HomeSettings[]; max: number };

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const [bannerMap, setBannerMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products`).then((r) => r.json()),
      fetch("/api/sub-categories-home").then((r) => r.json()).catch(() => ({ settings: [], max: 4 })),
    ])
      .then(([prods, config]) => {
        setProducts(prods);
        setHomeConfig(Array.isArray(config) ? { settings: config, max: 4 } : config);
        // Fetch all category banners in one bulk call
        const cats = [...new Set((prods as Product[]).map((p) => p.category).filter(Boolean))];
        if (cats.length) {
          fetch(`/api/admin/category-banners-bulk?categories=${encodeURIComponent(cats.join(","))}`)
            .then((r) => r.json())
            .then((data) => { if (data && typeof data === "object") setBannerMap(data); })
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach((p) => {
      const cat = p.category || "أخرى";
      (map[cat] ??= []).push(p);
    });
    // Sort each category the same way as the category page (storage → color)
    const parseStorage = (s?: string) => {
      if (!s) return 0;
      const n = parseFloat(s);
      if (s.includes("تيرا") || s.toLowerCase().includes("tb")) return n * 1024;
      return n || 0;
    };
    const colorOrder = (c?: string) => {
      if (!c) return 99;
      if (c.includes("برتقال") || c.toLowerCase().includes("orange")) return 0;
      if (c.includes("سيلفر") || c.toLowerCase().includes("silver")) return 1;
      if (c.includes("ازرق") || c.includes("أزرق") || c.toLowerCase().includes("blue")) return 2;
      return 3;
    };
    for (const cat of Object.keys(map)) {
      map[cat].sort((a, b) => {
        const storageDiff = parseStorage(a.storage) - parseStorage(b.storage);
        if (storageDiff !== 0) return storageDiff;
        return colorOrder(a.color) - colorOrder(b.color);
      });
    }
    return map;
  }, [products]);

  // If no settings configured yet, show all. Otherwise filter & sort by settings.
  const orderedCategories = useMemo(() => {
    const allCats = Object.keys(grouped).filter((c) => c !== "أخرى");
    if (!homeConfig) return allCats;
    const { settings, max } = homeConfig;
    const visibleSettings = settings.filter((s) => s.showInHome);
    if (visibleSettings.length === 0) return allCats;
    const orderedCats = visibleSettings
      .sort((a, b) => a.order - b.order)
      .slice(0, max)
      .map((s) => s.category)
      .filter((c, idx, arr) => arr.indexOf(c) === idx)
      .filter((c) => allCats.includes(c));
    // الكاتيجوريز الجديدة اللي ما عندها setting تظهر في الآخر
    const unconfigured = allCats.filter((c) => !settings.some((s) => s.category === c) && c !== "أخرى");
    return [...orderedCats, ...unconfigured];
  }, [grouped, homeConfig]);

  if (loading) return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {[1, 2, 3].map((g) => (
        <div key={g} className="mb-10">
          <div className="flex items-center gap-3 mb-6" dir="rtl">
            <div className="w-1.5 h-7 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-6 w-28 bg-gray-200 animate-pulse rounded-lg" />
            <div className="flex-1 h-px bg-gray-200" />
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
                <div className="w-full aspect-square bg-gradient-to-b from-gray-100 to-gray-50 animate-pulse" />
                <div className="h-[2px] bg-gray-100" />
                <div className="p-3 space-y-2.5">
                  <div className="h-3.5 bg-gray-200 animate-pulse rounded-md w-4/5" />
                  <div className="h-5 bg-gray-200 animate-pulse rounded-md w-2/5" />
                </div>
                <div className="px-3 pb-3"><div className="h-10 bg-gray-100 animate-pulse rounded-xl" /></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
  if (!products.length) return <p className="text-center text-gray-400 py-10">لا توجد منتجات حالياً</p>;

  return (
    <section className="w-full py-6 sm:py-8 overflow-hidden">
    <div className="max-w-6xl mx-auto px-3 sm:px-4">
      {orderedCategories.map((category, catIdx) => (
        <div key={category}>
          <div className="-mx-3 sm:-mx-4 mb-4 sm:mb-6 border-t border-gray-100 pt-4 sm:pt-6">
            <CategoryBanner category={category} images={bannerMap[category]} />
          </div>
          <CategoryRow category={category} items={grouped[category]} isFirst={catIdx === 0} />
        </div>
      ))}
    </div>
    </section>
  );
}
