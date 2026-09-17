import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/shop";
import { AdminGate, fieldClass, labelClass } from "@/components/site/AdminGate";

export const Route = createFileRoute("/admin/products")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Products — لوحة التحكم | AL-Qurem Fashion" },
      { name: "description", content: "Add, edit and remove AL-Qurem Fashion products." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProductsPage,
});

const CATEGORIES = [
  { slug: "men", ar: "رجالي", en: "Men" },
  { slug: "women", ar: "نسائي", en: "Women" },
  { slug: "kids", ar: "أطفال", en: "Kids" },
  { slug: "pajamas", ar: "بجامات", en: "Pajamas" },
  { slug: "offers", ar: "عروض", en: "Offers" },
];

type Draft = {
  id: string | null;
  category: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: string;
  old_price: string;
  sizes: string;
  image_url: string;
  is_active: boolean;
};

const EMPTY: Draft = {
  id: null,
  category: "men",
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  price: "",
  old_price: "",
  sizes: "",
  image_url: "",
  is_active: true,
};

/** Uploads to the private product bucket and returns a long-lived signed URL. */
async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signError || !data) throw signError ?? new Error("Could not create image link");
  return data.signedUrl;
}

function ProductsAdmin() {
  const { t, lang } = useLanguage();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        category: d.category,
        name_ar: d.name_ar,
        name_en: d.name_en || d.name_ar,
        description_ar: d.description_ar || null,
        description_en: d.description_en || null,
        price: Number(d.price || 0),
        old_price: d.old_price ? Number(d.old_price) : null,
        sizes: d.sizes
          ? d.sizes.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        image_url: d.image_url || null,
        is_active: d.is_active,
      };
      if (d.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", d.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-products"] });
      await qc.invalidateQueries({ queryKey: ["products"] });
      setDraft(EMPTY);
      setMsg({ kind: "ok", text: t("تم الحفظ ✓", "Saved ✓") });
    },
    onError: (e: Error) => setMsg({ kind: "error", text: e.message }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-products"] });
      await qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => setMsg({ kind: "error", text: e.message }),
  });

  async function onPickFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      const url = await uploadImage(file);
      setDraft((d) => ({ ...d, image_url: url }));
    } catch (err) {
      setMsg({ kind: "error", text: (err as Error).message });
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    save.mutate(draft);
  }

  return (
    <div className="space-y-12">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {draft.id ? t("تعديل منتج", "Edit product") : t("إضافة منتج", "Add a product")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "أضف صورة وسعر واسم المنتج، وسيظهر مباشرة في قسمه على الموقع.",
              "Add a photo, price and name — the product appears in its shop section right away.",
            )}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            {t("القسم", "Category")}
            <select
              className={fieldClass}
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {t(c.ar, c.en)}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            {t("الاسم بالعربية", "Name (Arabic)")}
            <input
              required
              className={fieldClass}
              value={draft.name_ar}
              onChange={(e) => setDraft({ ...draft, name_ar: e.target.value })}
            />
          </label>
          <label className={labelClass}>
            {t("الاسم بالإنجليزية", "Name (English)")}
            <input
              className={fieldClass}
              value={draft.name_en}
              onChange={(e) => setDraft({ ...draft, name_en: e.target.value })}
            />
          </label>
          <label className={labelClass}>
            {t("السعر (دينار)", "Price (JOD)")}
            <input
              required
              type="number"
              step="0.01"
              min="0"
              className={fieldClass}
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            />
          </label>
          <label className={labelClass}>
            {t("السعر قبل الخصم (اختياري)", "Old price (optional)")}
            <input
              type="number"
              step="0.01"
              min="0"
              className={fieldClass}
              value={draft.old_price}
              onChange={(e) => setDraft({ ...draft, old_price: e.target.value })}
            />
          </label>
          <label className={labelClass}>
            {t("المقاسات (افصل بفاصلة)", "Sizes (comma separated)")}
            <input
              className={fieldClass}
              placeholder="S, M, L, XL"
              value={draft.sizes}
              onChange={(e) => setDraft({ ...draft, sizes: e.target.value })}
            />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            {t("الوصف بالعربية", "Description (Arabic)")}
            <textarea
              rows={2}
              className={fieldClass}
              value={draft.description_ar}
              onChange={(e) => setDraft({ ...draft, description_ar: e.target.value })}
            />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            {t("الوصف بالإنجليزية", "Description (English)")}
            <textarea
              rows={2}
              className={fieldClass}
              value={draft.description_en}
              onChange={(e) => setDraft({ ...draft, description_en: e.target.value })}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <label className={labelClass}>
            {t("صورة المنتج", "Product photo")}
            <input
              type="file"
              accept="image/*"
              className="mt-1 block text-sm"
              onChange={(e) => void onPickFile(e.target.files?.[0])}
            />
          </label>
          {uploading && (
            <p className="text-sm text-muted-foreground">{t("جارٍ الرفع...", "Uploading...")}</p>
          )}
          {draft.image_url && (
            <img
              src={draft.image_url}
              alt={t("معاينة الصورة", "Photo preview")}
              className="h-20 w-20 object-cover"
            />
          )}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.is_active}
              onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
            />
            {t("معروض في المتجر", "Visible in the shop")}
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={save.isPending || uploading}
            className="bg-primary px-7 py-3 text-sm text-primary-foreground disabled:opacity-60"
          >
            {save.isPending
              ? t("جارٍ الحفظ...", "Saving...")
              : draft.id
                ? t("حفظ التعديلات", "Save changes")
                : t("إضافة المنتج", "Add product")}
          </button>
          {draft.id && (
            <button
              type="button"
              onClick={() => setDraft(EMPTY)}
              className="border border-border px-5 py-3 text-sm"
            >
              {t("إلغاء", "Cancel")}
            </button>
          )}
          {msg && (
            <p className={`text-sm ${msg.kind === "ok" ? "text-primary" : "text-destructive"}`}>
              {msg.text}
            </p>
          )}
        </div>
      </form>

      <section>
        <h2 className="font-display text-lg font-medium">
          {t("المنتجات الحالية", "Current products")}
        </h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("جارٍ التحميل...", "Loading...")}</p>
        ) : products.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {t("لا توجد منتجات بعد.", "No products yet.")}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-3">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="h-14 w-14 shrink-0 object-cover" />
                ) : (
                  <div className="h-14 w-14 shrink-0 bg-secondary" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{lang === "ar" ? p.name_ar : p.name_en}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.category} · {p.price} {t("د.أ", "JOD")}
                    {!p.is_active && ` · ${t("مخفي", "hidden")}`}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t("تعديل", "Edit")}
                  onClick={() =>
                    setDraft({
                      id: p.id,
                      category: p.category,
                      name_ar: p.name_ar,
                      name_en: p.name_en,
                      description_ar: p.description_ar ?? "",
                      description_en: p.description_en ?? "",
                      price: String(p.price),
                      old_price: p.old_price != null ? String(p.old_price) : "",
                      sizes: (p.sizes ?? []).join(", "),
                      image_url: p.image_url ?? "",
                      is_active: p.is_active,
                    })
                  }
                  className="p-2 text-muted-foreground hover:text-primary"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={t("حذف", "Delete")}
                  onClick={() => {
                    if (confirm(t("حذف هذا المنتج؟", "Delete this product?"))) remove.mutate(p.id);
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AdminProductsPage() {
  return (
    <LanguageProvider>
      <AdminGate>
        <ProductsAdmin />
      </AdminGate>
    </LanguageProvider>
  );
}
