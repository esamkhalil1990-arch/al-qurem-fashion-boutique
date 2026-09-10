import heroImage from "@/assets/hero.jpg";
import { useLanguage } from "@/lib/language";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[92vh] w-full overflow-hidden">
      <img
        src={heroImage}
        alt={t(
          "زبائن يتصفحون تشكيلة الملابس داخل متجر القرم للألبسة",
          "Customers browsing the clothing collection inside AL-Qurem Fashion",
        )}
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/55" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-28 pb-20 sm:px-8">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <p className="eyebrow text-ivory/80">
            {t("المقابلين · عمّان · الأردن", "Al-Muqabalain · Amman · Jordan")}
          </p>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ivory sm:text-6xl">
            {t("القرم للألبسة", "AL-Qurem Fashion")}
          </h1>
          <p className="mt-5 font-display text-xl text-ivory/90 sm:text-2xl">
            {t("جودة نلبسها... ثقة تدوم", "Quality we wear... trust that lasts")}
          </p>
          <p className="mt-6 max-w-xl text-ivory/80">
            {t(
              "في قلب المقابلين، محل يعرفه أهل المنطقة: ملابس رجالية ونسائية وأطفال، وبجامات مريحة، مرتّبة بعناية وبأسعار تناسب العائلة. تعال شوف بنفسك.",
              "In the heart of Al-Muqabalain, a shop the neighbourhood knows well: clothing for men, women and kids, plus comfortable pajamas — carefully picked and priced for the family. Come see for yourself.",
            )}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#categories"
              className="bg-primary px-7 py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("اكتشف التشكيلة", "Discover the Collection")}
            </a>
            <a
              href="#location"
              className="border border-ivory/60 px-7 py-3.5 text-sm tracking-wide text-ivory transition-colors hover:bg-ivory hover:text-ink"
            >
              {t("زورونا", "Visit Us")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
