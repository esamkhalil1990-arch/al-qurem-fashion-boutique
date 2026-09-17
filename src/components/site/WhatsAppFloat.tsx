import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useSettings } from "@/lib/settings";

export function WhatsAppFloat() {
  const { t } = useLanguage();
  const { whatsappHref } = useSettings();
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("راسلنا واتساب", "Message us on WhatsApp")}
      className="fixed bottom-5 start-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
