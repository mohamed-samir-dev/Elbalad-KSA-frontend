import { unstable_cache } from "next/cache";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

export const getCachedProducts = unstable_cache(
  async () => {
    try {
      const res = await fetch(`${BACKEND}/api/products`, { next: { tags: ["products"] } });
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },
  ["all-products"],
  { revalidate: 60, tags: ["products"] }
);

export const getCachedProduct = unstable_cache(
  async (id: string) => {
    try {
      const products: { _id: string }[] = await getCachedProducts();
      const found = products.find((p) => p._id === id);
      if (found) return found;
      const res = await fetch(`${BACKEND}/api/products/${id}`, { next: { tags: ["products"] } });
      return res.ok ? res.json() : null;
    } catch {
      return null;
    }
  },
  ["product"],
  { revalidate: false, tags: ["products"] }
);

export async function searchCachedProducts(q: string, brand?: string) {
  const products: Record<string, string>[] = await getCachedProducts();
  const query = q.toLowerCase();
  return products.filter((p) => {
    const matchQ = !q || p.name?.toLowerCase().includes(query) || p.brand?.toLowerCase().includes(query) || p.category?.toLowerCase().includes(query);
    const matchBrand = !brand || p.brand?.toLowerCase() === brand.toLowerCase();
    return matchQ && matchBrand;
  });
}
