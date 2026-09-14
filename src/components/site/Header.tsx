import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Instagram, Menu, MessageCircle, Phone, ShoppingBag, User, X } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { INSTAGRAM_URL, telHref, whatsappHref } from "@/lib/site-data";
import { useSession } from "@/lib/shop";
import { ArabicLogo } from "./ArabicLogo";

const NAV = [
  { id: "home", ar: "الرئيسية", en: "Home" },
  { id: "categories", ar: "الأقسام", en: "Categories" },
  { id: "offers", ar: "العروض", en: "Offers" },
  { id: "about", ar: "عن الفرع", en: "About" },
  { id: "location", ar: "الموقع", en: "Location" },
  { id: "contact", ar: "تواصل معنا", en: "Contact" },
];

export function Header({ solid = false }: { solid?: boolean }) {
  const { lang, setLang, t } = useLanguage();
  const { user } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onDark = !scrolled && !solid;

  const iconBtn = `p-2 transition-colors ${
    onDark ? "text-ivory/85 hover:text-ivory" : "text-foreground/80 hover:text-primary"
  }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/95 py-3 backdrop-blur-sm"
          : "border-b border-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#home" className="flex items-center gap-3 leading-tight">
          <ArabicLogo
            className={`h-11 w-[78px] shrink-0 ${onDark ? "text-gold" : "text-primary"}`}
          />
          <span className="hidden flex-col sm:flex">
            <span
              className={`font-display text-lg font-semibold tracking-tight sm:text-xl ${
                onDark ? "text-ivory" : "text-foreground"
              }`}
            >
              {t("القرم للألبسة", "AL-Qurem Fashion")}
            </span>
            <span className={`eyebrow text-[0.6rem] ${onDark ? "text-ivory/70" : ""}`}>
              {t("المقابلين · عمّان", "Al-Muqabalain · Amman")}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label={t("التنقل", "Main")}>
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-sm transition-colors ${
                onDark
                  ? "text-ivory/85 hover:text-ivory"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {t(item.ar, item.en)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={iconBtn}
            aria-label={t("واتساب", "WhatsApp")}
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${iconBtn} hidden sm:inline-flex`}
            aria-label={t("إنستغرام", "Instagram")}
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
          </a>
          <Link to="/favorites" className={iconBtn} aria-label={t("المفضلة", "Favorites")}>
            <Heart className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link to="/cart" className={iconBtn} aria-label={t("سلة التسوق", "Cart")}>
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            to="/login"
            className={iconBtn}
            aria-label={user ? t("حسابي", "My account") : t("تسجيل الدخول", "Sign in")}
          >
            <User className={`h-5 w-5 ${user ? "fill-current" : ""}`} aria-hidden="true" />
          </Link>
          <div
            className={`flex items-center border text-xs ${
              onDark ? "border-ivory/40" : "border-border"
            }`}
          >
            {(["ar", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`px-2.5 py-1.5 transition-colors ${
                  lang === code
                    ? "bg-primary text-primary-foreground"
                    : onDark
                      ? "text-ivory/80 hover:text-ivory"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <a
            href={telHref}
            className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs transition-colors ${
              onDark
                ? "border-ivory/50 text-ivory hover:bg-ivory hover:text-ink"
                : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
            aria-label={t("اتصل بنا", "Call us")}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t("اتصل بنا", "Call Us")}</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`p-1.5 lg:hidden ${onDark ? "text-ivory" : "text-foreground"}`}
            aria-label={t("فتح القائمة", "Open menu")}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={t("إغلاق القائمة", "Close menu")}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/50"
          />
          <div className="absolute inset-y-0 end-0 w-[78%] max-w-xs bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold">
                {t("القرم للألبسة", "AL-Qurem Fashion")}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("إغلاق القائمة", "Close menu")}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-6" aria-label={t("التنقل", "Mobile")}>
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="text-lg text-foreground transition-colors hover:text-primary"
                >
                  {t(item.ar, item.en)}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
