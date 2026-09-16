import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ADDRESS_AR,
  ADDRESS_EN,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  MAPS_URL,
  OPENING_HOURS,
  PHONE_DISPLAY,
  PHONE_NUMBER,
  PHONE_NUMBER_INTL,
  WHATSAPP_NUMBER,
  type OpeningHoursRow,
} from "./site-data";

export type { OpeningHoursRow };

export type SiteSettings = {
  phone_number: string;
  phone_intl: string;
  phone_display: string;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string;
  maps_url: string;
  address_ar: string;
  address_en: string;
  opening_hours: OpeningHoursRow[];
};

/** Fallback used before the database answers (and if it ever fails). */
export const DEFAULT_SETTINGS: SiteSettings = {
  phone_number: PHONE_NUMBER,
  phone_intl: PHONE_NUMBER_INTL,
  phone_display: PHONE_DISPLAY,
  whatsapp_number: WHATSAPP_NUMBER,
  instagram_url: INSTAGRAM_URL,
  facebook_url: FACEBOOK_URL,
  maps_url: MAPS_URL,
  address_ar: ADDRESS_AR,
  address_en: ADDRESS_EN,
  opening_hours: OPENING_HOURS,
};

export const settingsQueryKey = ["site-settings"];

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("*").maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_SETTINGS;
  return {
    phone_number: data.phone_number,
    phone_intl: data.phone_intl,
    phone_display: data.phone_display,
    whatsapp_number: data.whatsapp_number,
    instagram_url: data.instagram_url,
    facebook_url: data.facebook_url,
    maps_url: data.maps_url,
    address_ar: data.address_ar,
    address_en: data.address_en,
    opening_hours: (data.opening_hours as unknown as OpeningHoursRow[]) ?? [],
  };
}

export type SiteSettingsWithLinks = SiteSettings & {
  telHref: string;
  whatsappHref: string;
};

/** Live business details from the database, editable in the admin dashboard. */
export function useSettings(): SiteSettingsWithLinks {
  const { data } = useQuery({
    queryKey: settingsQueryKey,
    queryFn: fetchSettings,
    staleTime: 60_000,
  });

  const s = data ?? DEFAULT_SETTINGS;
  const digits = s.whatsapp_number.replace(/\D/g, "");
  return {
    ...s,
    telHref: s.phone_intl ? `tel:${s.phone_intl.replace(/\s/g, "")}` : s.maps_url,
    whatsappHref: digits ? `https://wa.me/${digits}` : s.maps_url,
  };
}
