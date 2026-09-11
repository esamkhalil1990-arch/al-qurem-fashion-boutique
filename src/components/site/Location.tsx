import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { useLanguage } from "@/lib/language";
import {
  ADDRESS_AR,
  ADDRESS_EN,
  MAPS_URL,
  OPENING_HOURS,
  PHONE_NUMBER,
  telHref,
} from "@/lib/site-data";
import { Reveal } from "./Section";

const EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  "Al-Hurriya Street, Al-Muqabalain, Amman, Jordan",
)}&output=embed`;

export function Location() {
  const { t } = useLanguage();

  return (
    <section id="location" className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">{t("الموقع", "Location")}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("فرع المقابلين — عمّان", "Al-Muqabalain branch — Amman")}
          </h2>

          <div className="mt-8 space-y-7">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-display text-base font-medium">{t("العنوان", "Address")}</h3>
                <p className="mt-1 text-muted-foreground">{t(ADDRESS_AR, ADDRESS_EN)}</p>
                <p className="mt-1 text-sm text-muted-foreground" dir={t("ltr", "rtl")}>
                  {t(ADDRESS_EN, ADDRESS_AR)}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-display text-base font-medium">
                  {t("ساعات العمل", "Opening hours")}
                </h3>
                <dl className="mt-3 divide-y divide-border border-y border-border">
                  {OPENING_HOURS.map((row) => (
                    <div
                      key={row.daysEn}
                      className="flex items-baseline justify-between gap-6 py-2.5"
                    >
                      <dt className="text-sm text-foreground">{t(row.daysAr, row.daysEn)}</dt>
                      <dd className="text-sm text-muted-foreground">{t(row.timeAr, row.timeEn)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-display text-base font-medium">{t("الهاتف", "Phone")}</h3>
                <a
                  href={telHref}
                  dir="ltr"
                  className="mt-1 inline-block text-muted-foreground transition-colors hover:text-primary"
                >
                  {PHONE_NUMBER}
                </a>
              </div>
            </div>
          </div>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Navigation className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            {t("احصل على الاتجاهات", "Get Directions")}
          </a>
        </Reveal>

        <Reveal className="min-h-[340px] border border-border bg-background">
          <iframe
            title={t("خريطة موقع فرع المقابلين", "Map of the Al-Muqabalain branch")}
            src={EMBED_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[340px] w-full"
          />
        </Reveal>
      </div>
    </section>
  );
}
