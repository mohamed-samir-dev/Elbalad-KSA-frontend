import BannerSlider from "./BannerSlider";

const API = process.env.BACKEND_URL || "http://localhost:5000";

export default async function Banner() {
  let images: string[] = [];

  try {
    const res = await fetch(`${API}/api/admin/banners`, { next: { revalidate: 60 } });
    const data: { url: string; active: boolean }[] = await res.json();
    if (Array.isArray(data))
      images = data.filter((b) => b.url && b.active).map((b) => b.url.startsWith("http") ? b.url : `${API}${b.url}`);
  } catch {
    images = ["/banner1.webp", "/banner2.webp"];
  }

  if (!images.length) return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a2e38] via-[#0f3d4a] to-[#155E6F]" />
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 lg:py-10">
        <div className="w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-black/10 backdrop-blur-sm border border-white/10 animate-pulse aspect-[3/4] sm:aspect-[16/9] lg:aspect-[2/1]" />
      </div>
    </section>
  );

  return <BannerSlider images={images} />;
}
