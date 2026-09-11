import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/language";
import {
  ADDRESS_EN,
  MAPS_URL,
  OPENING_HOURS_SCHEMA,
  PHONE_NUMBER_INTL,
} from "@/lib/site-data";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Categories } from "@/components/site/Categories";
import { Offers } from "@/components/site/Offers";
import { About } from "@/components/site/About";
import { Location } from "@/components/site/Location";
import { Social } from "@/components/site/Social";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

const TITLE = "AL-Qurem Fashion القرم للألبسة | Al-Muqabalain, Amman";
const DESCRIPTION =
  "AL-Qurem Fashion — القرم للألبسة: men's, women's, kids' clothing and pajamas on Al-Hurriya Street, Al-Muqabalain, Amman.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "ar_JO" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          name: "AL-Qurem Fashion",
          alternateName: "القرم للألبسة",
          slogan: "جودة نلبسها... ثقة تدوم",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Al-Hurriya Street, next to Al-Ostoura for Permanent Offers",
            addressLocality: "Al-Muqabalain, Amman",
            addressCountry: "JO",
          },
          telephone: PHONE_NUMBER_INTL,
          openingHours: OPENING_HOURS_SCHEMA,
          areaServed: "Amman, Jordan",
          hasMap: MAPS_URL,
          description: ADDRESS_EN,
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <LanguageProvider>
      <Header />
      <main>
        <Hero />
        <Categories />
        <Offers />
        <About />
        <Location />
        <Social />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
