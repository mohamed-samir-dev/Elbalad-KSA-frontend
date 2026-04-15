"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [category, setCategory] = useState("");
  const [inStock, setInStock] = useState(true);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories", { credentials: "include" })
      .then((r) => r.json())
      .then((data: string[]) => setCategories(data.filter(Boolean).sort()))
      .catch(() => {});
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("originalPrice", originalPrice);
      fd.append("salePrice", salePrice);
      fd.append("category", category);
      fd.append("inStock", String(inStock));
      fd.append("description", description);
      if (imageFile) fd.append("image", imageFile);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الإضافة");
      toast.success("تم إضافة المنتج بنجاح ✅");
      router.push("/admin/products");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-4 py-4">
      <h1 className="text-xl font-bold text-gray-800">إضافة منتج جديد</h1>

      {/* Image */}
      <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
      {imagePreview ? (
        <div
          onClick={() => imageInputRef.current?.click()}
          className="relative w-full h-48 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden cursor-pointer group"
        >
          <img src={imagePreview} alt="صورة المنتج" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">تغيير الصورة</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
        >
          <svg className="w-10 h-10 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-gray-500 group-hover:text-blue-600">اضغط لاختيار صورة</p>
          <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
        </button>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          اسم المنتج <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: iPhone 15 Pro Max"
          className={inputCls}
          required
        />
      </div>

      {/* Original Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          السعر قبل الخصم (ر.س) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
          className={inputCls}
          required
        />
        <p className="text-xs text-gray-400 mt-1">هذا هو السعر المشطوب عليه</p>
      </div>

      {/* Sale Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">سعر البيع (ر.س)</label>
        <input
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder="اتركه فارغاً إن لم يكن هناك خصم"
          min="0"
          step="0.01"
          className={inputCls}
        />
        <p className="text-xs text-red-400 mt-1">هذا هو السعر المعروض بالأحمر</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
          <option value="">-- اختر تصنيف --</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
        <select value={inStock ? "true" : "false"} onChange={(e) => setInStock(e.target.value === "true")} className={inputCls}>
          <option value="true">متوفر</option>
          <option value="false">غير متوفر</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="وصف المنتج..."
          rows={4}
          className={inputCls + " resize-none"}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "جاري الحفظ..." : "حفظ المنتج"}
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
