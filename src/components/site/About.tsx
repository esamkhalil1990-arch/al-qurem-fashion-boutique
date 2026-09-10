import storeImage from "@/assets/about-store.jpg";
import { useLanguage } from "@/lib/language";
import { Reveal } from "./Section";

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* [EDITABLE — replace with real branch photo] */}
        <Reveal>
          <figure className="relative">
            <img
              src={storeImage}
              alt={t(
                "صورة توضيحية لأجواء محل ألبسة دافئة ومرتبة",
                "Illustrative photo of a warm, tidy clothing shop interior",
              )}
              loading="lazy"
              width={1200}
              height={1008}
              className="w-full object-cover"
            />
            <figcaption className="placeholder-tag mt-3">
              {t(
                "[قابل للتعديل — استبدل بصورة حقيقية للفرع]",
                "[EDITABLE — replace with real branch photo]",
              )}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal>
          <p className="eyebrow">{t("عن الفرع", "About the branch")}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("محل حي، يعرف زبائنه", "A neighbourhood shop that knows its customers")}
          </h2>
          <div className="mt-6 space-y-5 text-muted-foreground">
            <p>
              {t(
                "فرع القرم للألبسة في المقابلين محل ألبسة بسيط ومرتّب، يخدم أهل المنطقة بملابس رجالية ونسائية وأطفال وبجامات. نختار البضاعة على أساس الجودة والراحة قبل أي شيء.",
                "The AL-Qurem Fashion branch in Al-Muqabalain is a simple, well-kept clothing shop serving the neighbourhood with clothing for men, women and kids, as well as pajamas. We pick our stock for quality and comfort first.",
              )}
            </p>
            <p>
              {t(
                "تلاقينا على شارع الحرية، بجانب الأسطورة للعروض الدائمة. مرحبا فيك تمرّ وتشوف التشكيلة على راحتك، وفريق المحل جاهز يساعدك بالمقاس والاختيار.",
                "You'll find us on Al-Hurriya Street, next to Al-Ostoura for Permanent Offers. Drop by and browse at your own pace — the team is happy to help with sizes and choices.",
              )}
            </p>
          </div>
          <p className="mt-8 border-s-2 border-primary ps-5 font-display text-lg text-foreground">
            {t("جودة نلبسها... ثقة تدوم", "Quality we wear... trust that lasts")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
