import CategorySlider from "./CategorySlider";
import { slugConfigs } from "../lib/categoryConfig";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

function resolveHref(catName: string): string {
  const name = catName?.trim();
  if (!name) return "/";

  // أقسام الصوت كلها توديها لـ /audio مباشرة
  if (
    name.toLowerCase().includes("سماعات") ||
    name.toLowerCase() === "speaker" ||
    name.toLowerCase() === "earbuds"
  ) return "/audio";

  // اكسسورات توديها لـ /games
  if (name === "اكسسورات") return "/games";

  // بطاريات متنقلة توديها لـ /accessories/anker-batteries
  if (name.includes("بطاريات")) return "/accessories/anker-batteries";

  for (const [slug, config] of Object.entries(slugConfigs)) {
    const parent = config.parentHref.replace(/^\//, "").split("/")[0];
    const path = `/${parent}/${slug}`;

    // مطابقة مباشرة بالـ category filter
    if (config.filters.category && config.filters.category === name) return path;

    // مطابقة بالـ nameIncludes
    if (config.filters.nameIncludes?.some((kw) => name.toLowerCase().includes(kw.toLowerCase()))) return path;
  }

  return `/search?q=${encodeURIComponent(name)}`;
}

type Category = { name: string; count: number; image: string };
type Setting = { category: string; subCategory: string; showInHome: boolean; order: number };

async function getCategories(): Promise<Category[]> {
  try {
    const [catRes, settingsRes] = await Promise.all([
      fetch(`${BACKEND}/api/admin/sub-categories/public`, { cache: "no-store" }),
      fetch(`${BACKEND}/api/admin/sub-categories/home-settings`, { cache: "no-store" }),
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
    <div className="w-full px-3 sm:px-6 py-4" dir="rtl" style={{ background: "linear-gradient(135deg, #f0faf5 0%, #e0f2f4 50%, #f5fbe8 100%)" }}>
    <section className="max-w-6xl mx-auto rounded-2xl py-10 shadow-md overflow-hidden bg-white/80 backdrop-blur-sm" dir="rtl">
      <div className="px-3 sm:px-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[#6DBE00]" />
          <h2 className="text-lg sm:text-xl font-bold text-[#155E6F] whitespace-nowrap">تسوق حسب الأقسام</h2>
          <div className="flex-1 h-px bg-[#6DBE00]" />
        </div>
        <CategorySlider categories={categoriesWithHref} />
      </div>
    </section>
    </div>
  );
}
