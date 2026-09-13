import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/language";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

/** Shared layout for inner pages: solid header + footer + WhatsApp bubble. */
export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Header solid />
      <main className="min-h-[70vh] pt-24">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </LanguageProvider>
  );
}
