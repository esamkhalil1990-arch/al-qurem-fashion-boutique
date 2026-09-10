import featured from "@/assets/offer-featured.jpg";
import { useLanguage } from "@/lib/language";
import { Reveal } from "./Section";

export function Offers() {
  const { t } = useLanguage();

  const placeholder = t(
    "[قابل للتعديل — تفاصيل العرض الحالي]",
    "[EDITABLE — Add current offer details]",
  );

  return (
    <section id="offers" className="bg-ink py-24 text-ivory sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-ivory/60">{t("العروض", "Offers")}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("عروض الفرع الحالية", "Current in-store offers")}
          </h2>
          <p className="mt-5 text-ivory/70">
            {t(
              "العروض تتغيّر حسب الموسم والتشكيلة المتوفرة في الفرع. التفاصيل أدناه تُحدَّث من قبل صاحب المحل.",
              "Offers change with the season and what's on the racks. The details below are filled in by the shop owner.",
            )}
          </p>
        </Reveal>

        <Reveal className="mt-14 grid gap-5 lg:grid-cols-5">
          <article className="relative overflow-hidden lg:col-span-3">
            <img
              src={featured}
              alt={t("تشكيلة ملابس شتوية بألوان عنابية وكريمية", "Winter garments in burgundy and cream tones")}
              loading="lazy"
              width={1600}
              height={912}
              className="h-full min-h-[320px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/55" />
            <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-10">
              <span className="eyebrow text-ivory/70">{t("العرض المميّز", "Featured offer")}</span>
              <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
                {t("عنوان العرض المميّز", "Featured offer title")}
              </h3>
              <p className="placeholder-tag mt-4 self-start bg-ivory/10 text-ivory">{placeholder}</p>
            </div>
          </article>

          <div className="grid gap-5 lg:col-span-2">
            {[1, 2, 3].map((n) => (
              <article key={n} className="border border-ivory/15 p-6 transition-colors hover:border-ivory/35">
                <span className="eyebrow text-ivory/50">
                  {t(`عرض ${n}`, `Offer ${n}`)}
                </span>
                <h3 className="mt-2 font-display text-lg font-medium">
                  {t("عنوان العرض", "Offer title")}
                </h3>
                <p className="placeholder-tag mt-3 bg-ivory/10 text-ivory">{placeholder}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <a
            href="#location"
            className="inline-block bg-primary px-7 py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("زورونا لمعرفة العروض", "Visit Us for Current Offers")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
