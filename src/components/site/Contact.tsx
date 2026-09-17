import { Facebook, Instagram, MessageCircle, Navigation, Phone } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useSettings } from "@/lib/settings";
import { Reveal } from "./Section";

export function Contact() {
  const { t } = useLanguage();
  const {
    facebook_url,
    instagram_url,
    maps_url,
    phone_display,
    whatsapp_number,
    telHref,
    whatsappHref,
  } = useSettings();

  return (
    <section id="contact" className="bg-secondary py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow">{t("تواصل معنا", "Contact")}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("سؤال عن مقاس أو توفّر؟", "A question about a size or availability?")}
          </h2>
          <p className="mt-5 text-muted-foreground">
            {t(
              "اتصل فينا أو راسلنا واتساب، ونجاوبك خلال ساعات الدوام.",
              "Call us or send a WhatsApp message and we'll reply during opening hours.",
            )}
          </p>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={telHref}
            className="inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span>{t("اتصل بنا", "Call Us")}</span>
            <span dir="ltr" className="opacity-90">
              <bdi>{phone_display}</bdi>
            </span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-primary px-7 py-3.5 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {t("راسلنا واتساب", "WhatsApp Us")}
          </a>
          <a
            href={maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border px-7 py-3.5 text-sm transition-colors hover:border-primary hover:text-primary"
          >
            <Navigation className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            {t("احصل على الاتجاهات", "Get Directions")}
          </a>
        </Reveal>

        {!whatsapp_number && (
          <Reveal className="mt-6 flex flex-col items-center gap-2">
            {!whatsapp_number && (
              <p className="placeholder-tag">
                {t("[قابل للتعديل — أضف رقم الواتساب]", "[EDITABLE — Add WhatsApp number]")}
              </p>
            )}
          </Reveal>
        )}

        <Reveal className="mt-10 flex justify-center gap-4">
          <a
            href={facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("صفحتنا على فيسبوك", "Our Facebook page")}
            className="border border-border p-3 transition-colors hover:border-primary hover:text-primary"
          >
            <Facebook className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href={instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("صفحتنا على إنستغرام", "Our Instagram page")}
            className="border border-border p-3 transition-colors hover:border-primary hover:text-primary"
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
