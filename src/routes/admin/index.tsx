import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_SETTINGS,
  settingsQueryKey,
  useSettings,
  type OpeningHoursRow,
} from "@/lib/settings";
import { AdminGate, fieldClass, labelClass } from "@/components/site/AdminGate";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Shop details — لوحة التحكم | AL-Qurem Fashion" },
      {
        name: "description",
        content: "Edit AL-Qurem Fashion phone, WhatsApp, address and opening hours.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSettingsPage,
});

function SettingsForm() {
  const { t } = useLanguage();
  const qc = useQueryClient();
  const settings = useSettings();

  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (hydrated) return;
    setForm({
      phone_number: settings.phone_number,
      phone_intl: settings.phone_intl,
      phone_display: settings.phone_display,
      whatsapp_number: settings.whatsapp_number,
      instagram_url: settings.instagram_url,
      facebook_url: settings.facebook_url,
      maps_url: settings.maps_url,
      address_ar: settings.address_ar,
      address_en: settings.address_en,
      opening_hours: settings.opening_hours,
    });
    setHydrated(true);
  }, [settings, hydrated]);

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setHour = (index: number, key: keyof OpeningHoursRow, value: string) =>
    setForm((f) => ({
      ...f,
      opening_hours: f.opening_hours.map((row, i) =>
        i === index ? { ...row, [key]: value } : row,
      ),
    }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase
      .from("site_settings")
      .update({
        phone_number: form.phone_number,
        phone_intl: form.phone_intl,
        phone_display: form.phone_display,
        whatsapp_number: form.whatsapp_number,
        instagram_url: form.instagram_url,
        facebook_url: form.facebook_url,
        maps_url: form.maps_url,
        address_ar: form.address_ar,
        address_en: form.address_en,
        opening_hours: form.opening_hours as unknown as never,
      })
      .eq("id", true);
    setBusy(false);
    if (error) {
      setMsg({ kind: "error", text: error.message });
      return;
    }
    await qc.invalidateQueries({ queryKey: settingsQueryKey });
    setMsg({ kind: "ok", text: t("تم الحفظ ✓", "Saved ✓") });
  }

  const texts: { key: keyof typeof form; ar: string; en: string }[] = [
    { key: "phone_display", ar: "رقم الهاتف كما يظهر", en: "Phone (as displayed)" },
    { key: "phone_number", ar: "رقم الهاتف المحلي", en: "Local phone number" },
    { key: "phone_intl", ar: "رقم الهاتف الدولي (للاتصال)", en: "International phone (for calls)" },
    { key: "whatsapp_number", ar: "رقم الواتساب (أرقام فقط)", en: "WhatsApp number (digits only)" },
    { key: "instagram_url", ar: "رابط إنستغرام", en: "Instagram link" },
    { key: "facebook_url", ar: "رابط فيسبوك", en: "Facebook link" },
    { key: "maps_url", ar: "رابط الخريطة", en: "Map link" },
    { key: "address_ar", ar: "العنوان بالعربية", en: "Address (Arabic)" },
    { key: "address_en", ar: "العنوان بالإنجليزية", en: "Address (English)" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {t("معلومات المحل", "Shop details")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            "أي تعديل هنا يظهر مباشرة في كل صفحات الموقع.",
            "Anything you change here updates across the whole site instantly.",
          )}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {texts.map((field) => (
          <label key={field.key} className={labelClass}>
            {t(field.ar, field.en)}
            <input
              type="text"
              value={String(form[field.key] ?? "")}
              onChange={(e) => set(field.key, e.target.value)}
              className={fieldClass}
              dir={field.key === "address_ar" ? "rtl" : "ltr"}
            />
          </label>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium">{t("ساعات العمل", "Opening hours")}</h2>
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({
                ...f,
                opening_hours: [
                  ...f.opening_hours,
                  { daysAr: "", daysEn: "", timeAr: "", timeEn: "" },
                ],
              }))
            }
            className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {t("إضافة صف", "Add row")}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {form.opening_hours.map((row, i) => (
            <div key={i} className="grid gap-3 border border-border p-4 sm:grid-cols-2">
              <label className={labelClass}>
                {t("الأيام (عربي)", "Days (Arabic)")}
                <input
                  className={fieldClass}
                  value={row.daysAr}
                  onChange={(e) => setHour(i, "daysAr", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                {t("الأيام (إنجليزي)", "Days (English)")}
                <input
                  className={fieldClass}
                  value={row.daysEn}
                  onChange={(e) => setHour(i, "daysEn", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                {t("الوقت (عربي)", "Time (Arabic)")}
                <input
                  className={fieldClass}
                  value={row.timeAr}
                  onChange={(e) => setHour(i, "timeAr", e.target.value)}
                />
              </label>
              <label className={labelClass}>
                {t("الوقت (إنجليزي)", "Time (English)")}
                <input
                  className={fieldClass}
                  value={row.timeEn}
                  onChange={(e) => setHour(i, "timeEn", e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    opening_hours: f.opening_hours.filter((_, idx) => idx !== i),
                  }))
                }
                className="inline-flex w-fit items-center gap-1.5 text-xs text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t("حذف الصف", "Remove row")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="bg-primary px-7 py-3 text-sm text-primary-foreground disabled:opacity-60"
        >
          {busy ? t("جارٍ الحفظ...", "Saving...") : t("حفظ التغييرات", "Save changes")}
        </button>
        {msg && (
          <p className={`text-sm ${msg.kind === "ok" ? "text-primary" : "text-destructive"}`}>
            {msg.text}
          </p>
        )}
      </div>
    </form>
  );
}

function AdminSettingsPage() {
  return (
    <LanguageProvider>
      <AdminGate>
        <SettingsForm />
      </AdminGate>
    </LanguageProvider>
  );
}
