import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useCart, useSession } from "@/lib/shop";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/site/PageLayout";
import { CATEGORY_IMAGES } from "@/components/site/ProductCard";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — سلة التسوق | AL-Qurem Fashion" },
      { name: "description", content: "Your shopping cart at AL-Qurem Fashion, Al-Muqabalain, Amman." },
    ],
  }),
  component: CartPage,
});

function CartContent() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const { data: items = [], isLoading } = useCart(user?.id);
  const qc = useQueryClient();

  const updateQty = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase.from("cart_items").delete().eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", id);
        if (error) throw error;
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["cart", user?.id] }),
  });

  if (loading) {
    return <p className="py-24 text-center text-muted-foreground">{t("جارٍ التحميل...", "Loading...")}</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold">{t("تسجيل الدخول", "Sign In")}</h1>
        <p className="mt-4 text-muted-foreground">
          {t("سجّل دخولك لتشوف سلّة التسوق.", "Sign in to view your shopping cart.")}
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

  const total = items.reduce((sum, i) => sum + (i.products?.price ?? 0) * i.quantity, 0);

  const orderText = items
    .map((i) => {
      const name = lang === "ar" ? i.products?.name_ar : i.products?.name_en;
      return `- ${name} x${i.quantity} (${(i.products?.price ?? 0) * i.quantity} JOD)`;
    })
    .join("\n");
  const checkoutUrl = `${whatsappHref}?text=${encodeURIComponent(
    `${t("طلب جديد من الموقع:", "New order from the website:")}\n${orderText}\n${t("المجموع", "Total")}: ${total} JOD`,
  )}`;

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("سلة التسوق", "Shopping Cart")}
      </h1>

      {isLoading ? (
        <p className="mt-16 text-center text-muted-foreground">{t("جارٍ التحميل...", "Loading...")}</p>
      ) : items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">{t("سلّتك فارغة حالياً.", "Your cart is empty.")}</p>
          <Link to="/" className="mt-6 inline-block bg-primary px-6 py-3 text-sm text-primary-foreground">
            {t("تابع التسوق", "Continue Shopping")}
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-border border border-border">
            {items.map((item) => {
              const p = item.products;
              if (!p) return null;
              return (
                <li key={item.id} className="flex items-center gap-4 p-4">
                  <img
                    src={p.image_url ?? CATEGORY_IMAGES[p.category]}
                    alt={t(p.name_ar, p.name_en)}
                    className="h-20 w-16 shrink-0 object-cover"
                    width={64}
                    height={80}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{t(p.name_ar, p.name_en)}</p>
                    <p className="mt-0.5 text-sm text-primary">
                      {p.price} {t("د.أ", "JOD")}
                    </p>
                  </div>
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      aria-label={t("تقليل الكمية", "Decrease quantity")}
                      onClick={() => updateQty.mutate({ id: item.id, quantity: item.quantity - 1 })}
                      className="p-2"
                    >
                      {item.quantity <= 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={t("زيادة الكمية", "Increase quantity")}
                      onClick={() => updateQty.mutate({ id: item.id, quantity: item.quantity + 1 })}
                      className="p-2"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-col items-end gap-4">
            <p className="text-lg">
              {t("المجموع:", "Total:")}{" "}
              <span className="font-semibold text-primary">{total.toFixed(2)} {t("د.أ", "JOD")}</span>
            </p>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary px-8 py-3.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("إتمام الطلب عبر واتساب", "Checkout via WhatsApp")}
            </a>
            <p className="text-xs text-muted-foreground">
              {t(
                "يُرسل طلبك إلى المحل عبر واتساب لتأكيد التوفر والاستلام.",
                "Your order is sent to the shop via WhatsApp to confirm availability and pickup.",
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function CartPage() {
  return (
    <PageLayout>
      <CartContent />
    </PageLayout>
  );
}
