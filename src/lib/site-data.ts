/**
 * Central place for every editable business detail.
 *
 * [EDITABLE] fields below are NOT verified — replace the placeholder values
 * with the real ones and the whole site (links, buttons, footer) updates.
 */

export const MAPS_URL = "https://maps.app.goo.gl/PUrVxKPikmSRssNu6";

/** Verified shop phone number (local + international dialling form). */
export const PHONE_NUMBER: string = "0782116684";
export const PHONE_NUMBER_INTL: string = "+962782116684";

/** [EDITABLE — أضف رقم الواتساب / Add WhatsApp number] digits only, e.g. "96279XXXXXXX" */
export const WHATSAPP_NUMBER: string = "";

/** Verified opening hours. */
export type OpeningHoursRow = {
  daysAr: string;
  daysEn: string;
  timeAr: string;
  timeEn: string;
};

export const OPENING_HOURS: OpeningHoursRow[] = [
  {
    daysAr: "السبت – الخميس",
    daysEn: "Saturday – Thursday",
    timeAr: "11:00 صباحًا – 11:00 مساءً",
    timeEn: "11:00 AM – 11:00 PM",
  },
  {
    daysAr: "الجمعة",
    daysEn: "Friday",
    timeAr: "3:00 عصرًا – 11:00 مساءً",
    timeEn: "3:00 PM – 11:00 PM",
  },
];

export const OPENING_HOURS_AR: string = OPENING_HOURS.map(
  (r) => `${r.daysAr}: ${r.timeAr}`,
).join(" · ");
export const OPENING_HOURS_EN: string = OPENING_HOURS.map(
  (r) => `${r.daysEn}: ${r.timeEn}`,
).join(" · ");

/** Schema.org openingHours strings. */
export const OPENING_HOURS_SCHEMA = [
  "Sa-Th 11:00-23:00",
  "Fr 15:00-23:00",
];

/** [EDITABLE — https://facebook.com/REPLACE_ME] */
export const FACEBOOK_URL = "https://facebook.com/REPLACE_ME";

/** [EDITABLE — https://instagram.com/REPLACE_ME] */
export const INSTAGRAM_URL = "https://instagram.com/REPLACE_ME";

export const telHref = PHONE_NUMBER
  ? `tel:${PHONE_NUMBER_INTL.replace(/\s/g, "")}`
  : MAPS_URL;
export const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`
  : MAPS_URL;

export const ADDRESS_AR = "شارع الحرية، بجانب الأسطورة للعروض الدائمة، عمّان، الأردن";
export const ADDRESS_EN =
  "Al-Hurriya Street, next to Al-Ostoura for Permanent Offers, Amman, Jordan";
