import men from "@/assets/cat-men.jpg";
import women from "@/assets/cat-women.jpg";
import kids from "@/assets/cat-kids.jpg";
import pajamas from "@/assets/cat-pajamas.jpg";
import offers from "@/assets/cat-offers.jpg";
import { useLanguage } from "@/lib/language";
import { Reveal, SectionHeading } from "./Section";

const CATEGORIES = [
  { ar: "رجالي", en: "Men", img: men, altAr: "قمصان وجاكيت رجالي", altEn: "Men's shirts and jacket" },
  { ar: "نسائي", en: "Women", img: women, altAr: "فستان وكارديغان نسائي", altEn: "Women's dress and cardigan" },
  { ar: "أطفال", en: "Kids", img: kids, altAr: "ملابس أطفال ملوّنة", altEn: "Colourful kids' clothing" },
  { ar: "بجامات", en: "Pajamas", img: pajamas, altAr: "طقم بجامة قطني مطوي", altEn: "Folded cotton pajama set" },
  { ar: "عروض", en: "Offers", img: offers, altAr: "رف ملابس ضمن العروض", altEn: "Clothing rack of offers", featured: true },
];

export function Categories() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow={t("الأقسام", "Categories")}
        title={t("كل ما تحتاجه العائلة تحت سقف واحد", "Everything the family needs, under one roof")}
        description={t(
          "تشكيلة متجدّدة للرجال والنساء والأطفال، مع ركن خاص للبجامات وركن للعروض.",
          "A regularly refreshed selection for men, women and kids, plus a pajamas corner and an offers corner.",
        )}
      />

      <ul className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((cat, i) => (
          <Reveal
            as="li"
            key={cat.en}
            className={`group relative overflow-hidden ${
              cat.featured ? "border-2 border-primary" : "border border-border"
            } ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}
          >
            <div className="aspect-[3/4] overflow-hidden bg-secondary">
              <img
                src={cat.img}
                alt={t(cat.altAr, cat.altEn)}
                loading="lazy"
                width={900}
                height={1200}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
            {cat.featured && (
              <span className="absolute top-3 end-3 bg-primary px-2.5 py-1 text-[0.65rem] tracking-widest text-primary-foreground uppercase">
                {t("عروض", "Offers")}
              </span>
            )}
            <h3 className="absolute bottom-4 start-4 font-display text-lg font-medium text-ivory">
              {t(cat.ar, cat.en)}
            </h3>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
