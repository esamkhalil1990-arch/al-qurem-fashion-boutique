import { Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import {
  useAddToCart,
  useSession,
  useToggleFavorite,
  type Product,
} from "@/lib/shop";
import men from "@/assets/cat-men.jpg";
import women from "@/assets/cat-women.jpg";
import kids from "@/assets/cat-kids.jpg";
import pajamas from "@/assets/cat-pajamas.jpg";
import offers from "@/assets/cat-offers.jpg";

export const CATEGORY_IMAGES: Record<string, string> = {
  men,
  women,
  kids,
  pajamas,
  offers,
};

export function ProductCard({
  product,
  isFav,
}: {
  product: Product;
  isFav: boolean;
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useSession();
  const toggleFav = useToggleFavorite(user?.id);
  const addToCart = useAddToCart(user?.id);

  const requireLogin = () => {
    if (!user) {
      navigate({ to: "/login" });
      return true;
    }
    return false;
  };

  return (
    <li className="group border border-border bg-background">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={product.image_url ?? CATEGORY_IMAGES[product.category] ?? men}
          alt={t(product.name_ar, product.name_en)}
          loading="lazy"
          width={900}
          height={1200}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => {
            if (requireLogin()) return;
            toggleFav.mutate({ productId: product.id, isFav });
          }}
          aria-pressed={isFav}
          aria-label={t("أضف إلى المفضلة", "Add to favorites")}
          className={`absolute top-3 end-3 p-2 transition-colors ${
            isFav ? "bg-primary text-primary-foreground" : "bg-background/90 text-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} aria-hidden="true" />
        </button>
        {product.old_price != null && product.old_price > product.price && (
          <span className="absolute top-3 start-3 bg-primary px-2 py-1 text-[0.65rem] tracking-widest text-primary-foreground uppercase">
            {t("خصم", "Sale")}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-medium">
          {t(product.name_ar, product.name_en)}
        </h3>
        <p className="mt-1 text-sm">
          <span className="font-semibold text-primary">{product.price} {t("د.أ", "JOD")}</span>
          {product.old_price != null && product.old_price > product.price && (
            <span className="ms-2 text-muted-foreground line-through">
              {product.old_price} {t("د.أ", "JOD")}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={() => {
            if (requireLogin()) return;
            addToCart.mutate({ productId: product.id });
          }}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-primary px-4 py-2.5 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {t("أضف إلى السلة", "Add to Cart")}
        </button>
      </div>
    </li>
  );
}
