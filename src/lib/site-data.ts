/**
 * Central place for every editable business detail.
 *
 * [EDITABLE] fields below are NOT verified — replace the placeholder values
 * with the real ones and the whole site (links, buttons, footer) updates.
 */

export const MAPS_URL = "https://maps.app.goo.gl/PUrVxKPikmSRssNu6";

/** [EDITABLE — أضف رقم الهاتف / Add phone number] e.g. "+96279XXXXXXX" */
export const PHONE_NUMBER: string = "";

/** [EDITABLE — أضف رقم الواتساب / Add WhatsApp number] digits only, e.g. "96279XXXXXXX" */
export const WHATSAPP_NUMBER: string = "";

/** [EDITABLE — أضف ساعات العمل / Add opening hours] e.g. "Sat–Thu 10:00 AM–10:00 PM" */
export const OPENING_HOURS_AR: string = "";
export const OPENING_HOURS_EN: string = "";

/** [EDITABLE — https://facebook.com/REPLACE_ME] */
export const FACEBOOK_URL = "https://facebook.com/REPLACE_ME";

/** [EDITABLE — https://instagram.com/REPLACE_ME] */
export const INSTAGRAM_URL = "https://instagram.com/REPLACE_ME";

export const telHref = PHONE_NUMBER ? `tel:${PHONE_NUMBER.replace(/\s/g, "")}` : MAPS_URL;
export const whatsappHref = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`
  : MAPS_URL;

export const ADDRESS_AR = "شارع الحرية، بجانب الأسطورة للعروض الدائمة، عمّان، الأردن";
export const ADDRESS_EN =
  "Al-Hurriya Street, next to Al-Ostoura for Permanent Offers, Amman, Jordan";
