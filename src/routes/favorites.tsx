import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { useFavorites, useSession } from "@/lib/shop";
import { PageLayout } from "@/components/site/PageLayout";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — المفضلة | AL-Qurem Fashion" },
      { name: "description", content: "Your favorite items at AL-Qurem Fashion, Al-Muqabalain, Amman." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesContent() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const { data: favorites = [], isLoading } = useFavorites(user?.id);

  if (loading) {
    return <p className="py-24 text-center text-muted-foreground">{t("جارٍ التحميل...", "Loading...")}</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold">{t("تسجيل الدخول", "Sign In")}</h1>
        <p className="mt-4 text-muted-foreground">
          {t("سجّل دخولك لتشوف قائمة المفضلة.", "Sign in to view your favorites.")}
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/login" })}
          className="mt-6 bg-primary px-7 py-3 text-sm text-primary-foreground"
        >
          {t("تسجيل الدخول", "Sign In")}
        </button>
      </div>
    );
  }

  const products = favorites.map((f) => f.products).filter((p) => p !== null);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("المفضلة", "Favorites")}
      </h1>

      {isLoading ? (
        <p className="mt-16 text-center text-muted-foreground">{t("جارٍ التحميل...", "Loading...")}</p>
      ) : products.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            {t("لم تضف شيئاً للمفضلة بعد.", "You haven't added any favorites yet.")}
          </p>
          <Link to="/" className="mt-6 inline-block bg-primary px-6 py-3 text-sm text-primary-foreground">
            {t("تصفح الأقسام", "Browse Categories")}
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} isFav />
          ))}
        </ul>
      )}
    </div>
  );
}

function FavoritesPage() {
  return (
    <PageLayout>
      <FavoritesContent />
    </PageLayout>
  );
}
