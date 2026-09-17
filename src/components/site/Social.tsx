import { Facebook, Instagram, MessageCircle } from "lucide-react";
import s1 from "@/assets/social-1.jpg";
import s2 from "@/assets/social-2.jpg";
import s3 from "@/assets/social-3.jpg";
import s4 from "@/assets/social-4.jpg";
import { useLanguage } from "@/lib/language";
import { useSettings } from "@/lib/settings";
import { Reveal, SectionHeading } from "./Section";

const TILES = [
  { img: s1, ar: "تفصيل قماش كنزة صوفية", en: "Close-up of knitwear fabric" },
  { img: s2, ar: "قمصان معلّقة على شمّاعات خشبية", en: "Shirts hanging on wooden hangers" },
  { img: s3, ar: "كيس تسوّق وملابس مطويّة", en: "Shopping bag with folded clothes" },
  { img: s4, ar: "ركن ملابس الأطفال", en: "Kids' clothing corner" },
];

export function Social() {
  const { t } = useLanguage();
  const { facebook_url, instagram_url, whatsappHref } = useSettings();

  return (
    <section id="social" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow={t("تابعنا", "Follow us")}
        title={t("شوف الجديد أول بأول", "See what's new, first")}
        description={t(
          "تابع صفحاتنا لتشوف التشكيلات الجديدة والعروض قبل ما توصل الرفوف.",
          "Follow our pages to see new arrivals and offers before they reach the racks.",
        )}
      />

      <Reveal className="mt-10 flex flex-wrap gap-3">
        <a
          href={facebook_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
        >
          <Facebook className="h-4 w-4" aria-hidden="true" />
          {t("فيسبوك", "Facebook")}
        </a>
        <a
          href={instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
        >
          <Instagram className="h-4 w-4" aria-hidden="true" />
          {t("إنستغرام", "Instagram")}
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm transition-colors hover:border-primary hover:text-primary"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {t("واتساب", "WhatsApp")}
        </a>
      </Reveal>

      <p className="placeholder-tag mt-5">
        {t(
          "[قابل للتعديل — روابط فيسبوك وإنستغرام: https://facebook.com/REPLACE_ME · https://instagram.com/REPLACE_ME]",
          "[EDITABLE — Facebook & Instagram links: https://facebook.com/REPLACE_ME · https://instagram.com/REPLACE_ME]",
        )}
      </p>

      <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        {TILES.map((tile) => (
          <Reveal as="li" key={tile.en} className="group overflow-hidden border border-border">
            <img
              src={tile.img}
              alt={t(tile.ar, tile.en)}
              loading="lazy"
              width={800}
              height={800}
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
