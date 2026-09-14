import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { PageLayout } from "@/components/site/PageLayout";

type Policy = {
  titleAr: string;
  titleEn: string;
  bodyAr: string[];
  bodyEn: string[];
};

/**
 * [EDITABLE] Policy texts below are reasonable placeholders for a small
 * clothing shop — replace with the shop's real policies.
 */
const POLICIES: Record<string, Policy> = {
  exchange: {
    titleAr: "سياسة الاستبدال",
    titleEn: "Exchange Policy",
    bodyAr: [
      "يمكن استبدال أي قطعة خلال 3 أيام من تاريخ الشراء، بشرط أن تكون بحالتها الأصلية مع الفاتورة.",
      "لا يشمل الاستبدال القطع المخفّضة ضمن العروض النهائية أو الملابس الداخلية والبجامات المفتوحة، حفاظاً على النظافة.",
      "الاستبدال يتم في الفرع فقط خلال ساعات الدوام.",
    ],
    bodyEn: [
      "Any item can be exchanged within 3 days of purchase, provided it is in its original condition with the receipt.",
      "Final-sale items and opened underwear or pajamas cannot be exchanged, for hygiene reasons.",
      "Exchanges are made at the branch only, during opening hours.",
    ],
  },
  return: {
    titleAr: "سياسة الإرجاع",
    titleEn: "Return Policy",
    bodyAr: [
      "يمكن إرجاع أي قطعة خلال 24 ساعة من الشراء بحالتها الأصلية مع الفاتورة واسترداد المبلغ.",
      "بعد 24 ساعة يكون الخيار المتاح هو الاستبدال فقط وفق سياسة الاستبدال.",
      "الإرجاع يتم في الفرع فقط خلال ساعات الدوام.",
    ],
    bodyEn: [
      "Any item can be returned within 24 hours of purchase in its original condition with the receipt for a refund.",
      "After 24 hours, exchange only is available per our exchange policy.",
      "Returns are made at the branch only, during opening hours.",
    ],
  },
  delivery: {
    titleAr: "معلومات التوصيل",
    titleEn: "Delivery Information",
    bodyAr: [
      "الشراء حالياً من الفرع مباشرة في المقابلين — عمّان.",
      "للطلبات عبر واتساب، يتم تأكيد التوفر أولاً ثم الاتفاق على طريقة الاستلام أو التوصيل داخل عمّان عند توفره.",
      "أوقات الرد على الطلبات ضمن ساعات الدوام الرسمية للفرع.",
    ],
    bodyEn: [
      "Purchases are currently made directly at the branch in Al-Muqabalain, Amman.",
      "For WhatsApp orders, availability is confirmed first, then pickup or delivery within Amman is arranged when available.",
      "Order responses are handled during official opening hours.",
    ],
  },
  privacy: {
    titleAr: "سياسة الخصوصية",
    titleEn: "Privacy Policy",
    bodyAr: [
      "نحتفظ فقط بالمعلومات اللازمة لإدارة حسابك وطلباتك، مثل اسمك وبريدك الإلكتروني ومحتوى سلّة التسوق والمفضلة.",
      "لا نشارك بياناتك مع أي طرف ثالث لأغراض تسويقية.",
      "عند التواصل عبر واتساب تطبق سياسة خصوصية واتساب على تلك المحادثات.",
      "يمكنك طلب حذف حسابك وبياناتك في أي وقت بالتواصل معنا.",
    ],
    bodyEn: [
      "We only keep the information needed to manage your account and orders, such as your name, email, cart, and favorites.",
      "We never share your data with third parties for marketing purposes.",
      "When you contact us via WhatsApp, WhatsApp's own privacy policy applies to those conversations.",
      "You can request deletion of your account and data at any time by contacting us.",
    ],
  },
  terms: {
    titleAr: "الشروط والأحكام",
    titleEn: "Terms & Conditions",
    bodyAr: [
      "الأسعار المعروضة بالدينار الأردني وقد تتغير حسب الموسم والتشكيلة المتوفرة.",
      "توفر القطع يتأكد عند التواصل مع الفرع، فالكميات في المحل محدودة ومتجددة.",
      "استخدام الموقع يعني موافقتك على هذه الشروط وسياسات الاستبدال والإرجاع.",
    ],
    bodyEn: [
      "Prices are shown in Jordanian Dinar and may change with seasons and available stock.",
      "Item availability is confirmed when you contact the branch, as in-store quantities are limited and refreshed.",
      "Using this website means you accept these terms and our exchange and return policies.",
    ],
  },
};

export const Route = createFileRoute("/policy/$slug")({
  head: ({ params }) => {
    const p = POLICIES[params.slug];
    const title = p ? `${p.titleEn} — ${p.titleAr} | AL-Qurem Fashion` : "AL-Qurem Fashion";
    return {
      meta: [
        { title },
        { name: "description", content: `${p?.titleEn ?? "Store policy"} — AL-Qurem Fashion, Al-Muqabalain, Amman.` },
      ],
    };
  },
  component: PolicyPage,
});

function PolicyContent() {
  const { slug } = Route.useParams();
  const { t, lang } = useLanguage();
  const policy = POLICIES[slug];

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

  const paragraphs = lang === "ar" ? policy.bodyAr : policy.bodyEn;

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
