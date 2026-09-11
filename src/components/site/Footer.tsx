import { Facebook, Instagram } from "lucide-react";
import { useLanguage } from "@/lib/language";
import {
  ADDRESS_AR,
  OPENING_HOURS,
  ADDRESS_EN,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  PHONE_NUMBER,
  telHref,
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
  { ar: "رجالي", en: "Men" },
  { ar: "نسائي", en: "Women" },
  { ar: "أطفال", en: "Kids" },
  { ar: "بجامات", en: "Pajamas" },
  { ar: "عروض", en: "Offers" },
];

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink py-16 text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
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
                <a href={`#${item.id}`} className="text-ivory/75 transition-colors hover:text-ivory">
                  {t(item.ar, item.en)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-ivory/50">{t("الأقسام", "Categories")}</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/75">
            {CATS.map((c) => (
              <li key={c.en}>{t(c.ar, c.en)}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-ivory/50">{t("تواصل", "Contact")}</h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-ivory/75">
            <p>{t(ADDRESS_AR, ADDRESS_EN)}</p>
            {PHONE_NUMBER ? (
              <a href={telHref} className="block transition-colors hover:text-ivory">
                {PHONE_NUMBER}
              </a>
            ) : (
              <span className="placeholder-tag bg-ivory/10 text-ivory">
                {t("[قابل للتعديل — أضف رقم الهاتف]", "[EDITABLE — Add phone number]")}
              </span>
            )}
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
