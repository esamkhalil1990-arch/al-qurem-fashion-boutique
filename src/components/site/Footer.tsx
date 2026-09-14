import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import {
  ADDRESS_AR,
  OPENING_HOURS,
  ADDRESS_EN,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  telHref,
  whatsappHref,
} from "@/lib/site-data";

const NAV = [
  { id: "home", ar: "الرئيسية", en: "Home" },
  { id: "categories", ar: "الأقسام", en: "Categories" },
  { id: "offers", ar: "العروض", en: "Offers" },
  { id: "about", ar: "عن الفرع", en: "About" },
  { id: "location", ar: "الموقع", en: "Location" },
  { id: "contact", ar: "تواصل معنا", en: "Contact" },
];

const CATS = [
  { slug: "men", ar: "رجالي", en: "Men" },
  { slug: "women", ar: "نسائي", en: "Women" },
  { slug: "kids", ar: "أطفال", en: "Kids" },
  { slug: "pajamas", ar: "بجامات", en: "Pajamas" },
  { slug: "offers", ar: "عروض", en: "Offers" },
];

const POLICIES = [
  { slug: "exchange", ar: "سياسة الاستبدال", en: "Exchange Policy" },
  { slug: "return", ar: "سياسة الإرجاع", en: "Return Policy" },
  { slug: "delivery", ar: "معلومات التوصيل", en: "Delivery Info" },
  { slug: "privacy", ar: "سياسة الخصوصية", en: "Privacy Policy" },
  { slug: "terms", ar: "الشروط والأحكام", en: "Terms & Conditions" },
];

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink py-16 text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="font-display text-lg font-semibold">
            {t("القرم للألبسة", "AL-Qurem Fashion")}
          </p>
          <p className="eyebrow mt-1 text-ivory/50">
            {t("AL-Qurem Fashion", "القرم للألبسة")}
          </p>
          <p className="mt-5 text-sm text-ivory/70">
            {t(
              "محل ألبسة في المقابلين بعمّان، يقدّم ملابس رجالية ونسائية وأطفال بجودة نثق فيها.",
              "A clothing shop in Al-Muqabalain, Amman, offering men's, women's and kids' clothing we trust.",
            )}
          </p>
        </div>

        <nav aria-label={t("روابط الموقع", "Footer navigation")}>
          <h2 className="eyebrow text-ivory/50">{t("روابط", "Links")}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.id}>
                <a href={`/#${item.id}`} className="text-ivory/75 transition-colors hover:text-ivory">
                  {t(item.ar, item.en)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("الأقسام", "Categories")}>
          <h2 className="eyebrow text-ivory/50">{t("الأقسام", "Categories")}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {CATS.map((c) => (
              <li key={c.en}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="text-ivory/75 transition-colors hover:text-ivory"
                >
                  {t(c.ar, c.en)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("السياسات", "Policies")}>
          <h2 className="eyebrow text-ivory/50">{t("السياسات", "Policies")}</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {POLICIES.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/policy/$slug"
                  params={{ slug: p.slug }}
                  className="text-ivory/75 transition-colors hover:text-ivory"
                >
                  {t(p.ar, p.en)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-ivory/50">{t("تواصل", "Contact")}</h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-ivory/75">
            <p>{t(ADDRESS_AR, ADDRESS_EN)}</p>
            <a href={telHref} dir="ltr" className="block transition-colors hover:text-ivory">
              <bdi>{PHONE_DISPLAY}</bdi>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-colors hover:text-ivory"
            >
              {t("واتساب", "WhatsApp")}
            </a>
          </address>
          <ul className="mt-4 space-y-1 text-sm text-ivory/70">
            {OPENING_HOURS.map((row) => (
              <li key={row.daysEn}>
                {t(row.daysAr, row.daysEn)} · {t(row.timeAr, row.timeEn)}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("فيسبوك", "Facebook")}
              className="border border-ivory/25 p-2.5 transition-colors hover:border-ivory"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("إنستغرام", "Instagram")}
              className="border border-ivory/25 p-2.5 transition-colors hover:border-ivory"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("واتساب", "WhatsApp")}
              className="border border-ivory/25 p-2.5 transition-colors hover:border-ivory"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-ivory/15 px-5 pt-6 sm:px-8">
        <p className="text-xs text-ivory/55">
          © {year} AL-Qurem Fashion — القرم للألبسة.{" "}
          {t("جميع الحقوق محفوظة.", "All rights reserved.")}
        </p>
      </div>
    </footer>
  );
}
