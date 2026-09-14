import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/lib/language";
import { useFavorites, useProducts, useSession } from "@/lib/shop";
import { PageLayout } from "@/components/site/PageLayout";
import { ProductCard } from "@/components/site/ProductCard";

const CATEGORIES: Record<string, { ar: string; en: string }> = {
  men: { ar: "رجالي", en: "Men" },
  women: { ar: "نسائي", en: "Women" },
  kids: { ar: "أطفال", en: "Kids" },
  pajamas: { ar: "بجامات", en: "Pajamas" },
  offers: { ar: "عروض", en: "Offers" },
};

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const c = CATEGORIES[params.slug];
    const title = c ? `${c.en} — ${c.ar} | AL-Qurem Fashion` : "AL-Qurem Fashion";
    return {
      meta: [
        { title },
        { name: "description", content: `Shop ${c?.en ?? ""} clothing at AL-Qurem Fashion, Al-Muqabalain, Amman.` },
        { property: "og:title", content: title },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryContent() {
  const { slug } = Route.useParams();
  const { t } = useLanguage();
  const { user } = useSession();
  const [sort, setSort] = useState("newest");
  const { data: products = [], isLoading } = useProducts(slug, sort);
  const { data: favorites = [] } = useFavorites(user?.id);
  const favIds = new Set(favorites.map((f) => f.product_id));

  const cat = CATEGORIES[slug];

  if (!cat) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold">
          {t("هذا القسم غير موجود", "This category doesn't exist")}
        </h1>
        <Link to="/" className="mt-6 inline-block bg-primary px-6 py-3 text-sm text-primary-foreground">
          {t("العودة للرئيسية", "Back to Home")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <nav className="text-sm text-muted-foreground" aria-label="breadcrumb">
        <Link to="/" className="hover:text-primary">{t("الرئيسية", "Home")}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{t(cat.ar, cat.en)}</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t(cat.ar, cat.en)}
        </h1>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("تصفية", "Sort")}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="newest">{t("الأحدث", "Newest")}</option>
            <option value="price-asc">{t("السعر: الأقل أولاً", "Price: Low to High")}</option>
            <option value="price-desc">{t("السعر: الأعلى أولاً", "Price: High to Low")}</option>
          </select>
        </label>
      </div>

      {isLoading ? (
        <p className="mt-16 text-center text-muted-foreground">{t("جارٍ التحميل...", "Loading...")}</p>
      ) : products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          {t("لا توجد منتجات", "No products yet")}
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} isFav={favIds.has(p.id)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoryPage() {
  return (
    <PageLayout>
      <CategoryContent />
    </PageLayout>
  );
}
