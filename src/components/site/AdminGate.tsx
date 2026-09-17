import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { useSession } from "@/lib/shop";
import { useIsAdmin } from "@/lib/admin";
import { PageLayout } from "./PageLayout";

const TABS = [
  { to: "/admin", ar: "معلومات المحل", en: "Shop details" },
  { to: "/admin/products", ar: "المنتجات", en: "Products" },
] as const;

/** Wraps admin pages: signs-in check + admin-role check + shared tab bar. */
export function AdminGate({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { user, loading } = useSession();
  const { data: isAdmin, isLoading } = useIsAdmin(user?.id);

  let body: ReactNode;

  if (loading || (user && isLoading)) {
    body = (
      <p className="py-24 text-center text-muted-foreground">{t("جارٍ التحميل...", "Loading...")}</p>
    );
  } else if (!user) {
    body = (
      <div className="mx-auto max-w-md px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold">{t("لوحة التحكم", "Admin")}</h1>
        <p className="mt-4 text-muted-foreground">
          {t("سجّل دخولك بحساب المالك للمتابعة.", "Sign in with the owner account to continue.")}
        </p>
        <Link to="/login" className="mt-6 inline-block bg-primary px-7 py-3 text-sm text-primary-foreground">
          {t("تسجيل الدخول", "Sign In")}
        </Link>
      </div>
    );
  } else if (!isAdmin) {
    body = (
      <div className="mx-auto max-w-md px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold">{t("غير مصرّح", "Not allowed")}</h1>
        <p className="mt-4 text-muted-foreground">
          {t(
            "هذه الصفحة مخصّصة لصاحب المحل فقط.",
            "This page is only available to the shop owner.",
          )}
        </p>
      </div>
    );
  } else {
    body = (
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <nav className="mb-10 flex gap-2 border-b border-border" aria-label={t("لوحة التحكم", "Admin")}>
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "border-primary text-primary" }}
              inactiveProps={{ className: "border-transparent text-muted-foreground" }}
              className="-mb-px border-b-2 px-4 py-3 text-sm transition-colors hover:text-primary"
            >
              {t(tab.ar, tab.en)}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    );
  }

  return <PageLayout>{body}</PageLayout>;
}

export const fieldClass =
  "mt-1 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
export const labelClass = "block text-sm text-muted-foreground";
