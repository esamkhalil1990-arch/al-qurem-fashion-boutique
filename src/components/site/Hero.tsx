import { useLanguage } from "@/lib/language";
import { ArabicLogo } from "./ArabicLogo";
import { OPENING_HOURS, PHONE_NUMBER, telHref } from "@/lib/site-data";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-[92vh] w-full overflow-hidden bg-ink text-ivory"
    >
      {/* soft light pools + subtle grain-free gradient wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, var(--primary) 45%, transparent) 0%, transparent 60%), radial-gradient(90% 70% at 50% 110%, color-mix(in oklab, var(--gold) 22%, transparent) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 mx-auto h-px max-w-4xl -translate-y-1/2 bg-gradient-to-r from-transparent via-ivory/15 to-transparent"
      />

      <div className="relative mx-auto flex min-h-[92vh] max-w-5xl flex-col items-center justify-center px-5 pt-28 pb-20 text-center sm:px-8">
        <p className="eyebrow text-ivory/70">
          {t("المقابلين · عمّان · الأردن", "Al-Muqabalain · Amman · Jordan")}
        </p>

        <ArabicLogo
          animated
          className="mt-8 w-[min(78vw,520px)] text-gold drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
        />

        <h1 className="sr-only">{t("القرم للألبسة", "AL-Qurem Fashion")}</h1>

        <p className="mt-6 font-display text-xl text-ivory/90 sm:text-2xl">
          {t("جودة نلبسها... ثقة تدوم", "Quality we wear... trust that lasts")}
        </p>

        <p className="mt-6 max-w-xl text-ivory/75">
          {t(
            "في قلب المقابلين، محل يعرفه أهل المنطقة: ملابس رجالية ونسائية وأطفال، وبجامات مريحة، مرتّبة بعناية وبأسعار تناسب العائلة.",
            "In the heart of Al-Muqabalain, a shop the neighbourhood knows well: clothing for men, women and kids, plus comfortable pajamas — carefully picked and priced for the family.",
          )}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="#categories"
            className="bg-primary px-7 py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("اكتشف التشكيلة", "Discover the Collection")}
          </a>
          <a
            href={telHref}
            className="border border-ivory/60 px-7 py-3.5 text-sm tracking-wide text-ivory transition-colors hover:bg-ivory hover:text-ink"
            dir="ltr"
          >
            {PHONE_NUMBER}
          </a>
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-ivory/70">
          {OPENING_HOURS.map((row) => (
            <li key={row.daysEn}>
              <span className="text-ivory/90">{t(row.daysAr, row.daysEn)}</span>
              {" · "}
              <span>{t(row.timeAr, row.timeEn)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
