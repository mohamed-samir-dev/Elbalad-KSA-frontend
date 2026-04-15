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
    <section className="w-full flex justify-center py-6 px-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-200" style={{ aspectRatio: "1.8/1" }} />
    </section>
  );

  return <BannerSlider images={images} />;
}
