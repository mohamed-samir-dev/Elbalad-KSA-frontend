import CategorySlider from "./CategorySlider";
import { slugConfigs } from "../lib/categoryConfig";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

function resolveHref(catName: string): string {
  const name = catName?.trim();
  if (!name) return "/";

  if (
    name.toLowerCase().includes("سماعات") ||
    name.toLowerCase() === "speaker" ||
    name.toLowerCase() === "earbuds"
  ) return "/audio";

  if (name === "اكسسورات") return "/games";
  if (name.includes("بطاريات")) return "/accessories/anker-batteries";

  for (const [slug, config] of Object.entries(slugConfigs)) {
    const parent = config.parentHref.replace(/^\//, "").split("/")[0];
    const path = `/${parent}/${slug}`;
    if (config.filters.category && config.filters.category === name) return path;
    if (config.filters.nameIncludes?.some((kw) => name.toLowerCase().includes(kw.toLowerCase()))) return path;
  }

  return `/search?q=${encodeURIComponent(name)}`;
}

type Category = { name: string; count: number; image: string };
type Setting = { category: string; subCategory: string; showInHome: boolean; order: number };

async function getCategories(): Promise<Category[]> {
  try {
    const [catRes, settingsRes] = await Promise.all([
      fetch(`${BACKEND}/api/admin/sub-categories/public`, { next: { revalidate: 3600 } }),
      fetch(`${BACKEND}/api/admin/sub-categories/home-settings`, { next: { revalidate: 3600 } }),
    ]);
    const allCats: Category[] = catRes.ok ? await catRes.json() : [];
    const settings: Setting[] = settingsRes.ok ? await settingsRes.json() : [];

    const orderMap = new Map(
      settings.filter((s) => s.showInHome).map((s) => [s.category, s.order])
    );

    return allCats.sort((a, b) => {
      const aHome = orderMap.has(a.name);
      const bHome = orderMap.has(b.name);
      if (aHome && !bHome) return -1;
      if (!aHome && bHome) return 1;
      if (aHome && bHome) return (orderMap.get(a.name) ?? 0) - (orderMap.get(b.name) ?? 0);
      return 0;
    });
  } catch {
    return [];
  }
}

export default async function ShopByCategory() {
  const categories = await getCategories();
  if (!categories.length) return null;

  const categoriesWithHref = categories.map((cat) => ({
    ...cat,
    href: resolveHref(cat.name),
  }));

  return (
    <div className="w-full" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6DBE00] font-semibold uppercase tracking-widest mb-0.5">تصفح</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">تسوق حسب الأقسام</h2>
          </div>
          <div className="h-10 w-1 rounded-full bg-gradient-to-b from-[#155E6F] to-[#6DBE00]" />
        </div>
      </div>

      {/* Slider */}
      <div className="bg-[#f8fafb] px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <CategorySlider categories={categoriesWithHref} />
        </div>
      </div>
    </div>
  );
}
