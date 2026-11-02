import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { PageLayout } from "@/components/site/PageLayout";

import { POLICIES } from "@/lib/policy-defaults";
import { useContentRows } from "@/lib/content";

export const Route = createFileRoute("/policy/$slug")({
  head: ({ params }) => {
    const p = POLICIES[params.slug];
    const title = p ? `${p.titleEn} — ${p.titleAr} | AL-Qurem Fashion` : "AL-Qurem Fashion";
    return {
      meta: [
        { title },
        { name: "description", content: `${p?.titleEn ?? "Store policy"} — AL-Qurem Fashion, Al-Muqabalain, Amman.` },
      { property: "og:title", content: title },
      { property: "og:description", content: `${p?.titleEn ?? "Store policy"} — AL-Qurem Fashion, Al-Muqabalain, Amman.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: PolicyPage,
});

function PolicyContent() {
  const { slug } = Route.useParams();
  const { t, lang } = useLanguage();
  const {data:rows=[]}=useContentRows();
  const policy = POLICIES[slug];
  const override=rows.find(r=>r.key===`policy:${slug}`);

  if (!policy) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold">
          {t("هذه الصفحة غير موجودة", "This page doesn't exist")}
        </h1>
        <Link to="/" className="mt-6 inline-block bg-primary px-6 py-3 text-sm text-primary-foreground">
          {t("العودة للرئيسية", "Back to Home")}
        </Link>
      </div>
    );
  }

  const paragraphs = override ? (lang==="ar"?override.text_ar:override.text_en).split("\n").filter(Boolean) : lang === "ar" ? policy.bodyAr : policy.bodyEn;

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {t(policy.titleAr, policy.titleEn)}
      </h1>
      <div className="mt-8 space-y-4 leading-relaxed text-foreground/90">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="placeholder-tag mt-8">
        {t("[قابل للتعديل — نص السياسة مؤقت ويُستبدل بسياسة المحل الرسمية]", "[EDITABLE — Placeholder policy text, replace with the shop's official policy]")}
      </p>
    </article>
  );
}

function PolicyPage() {
  return (
    <PageLayout>
      <PolicyContent />
    </PageLayout>
  );
}
