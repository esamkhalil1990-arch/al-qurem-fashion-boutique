export const RESEND_COOLDOWN_SECONDS = 30;

type Translate = (ar: string, en: string) => string;

/** Explain hosted password rules without exposing provider internals or submitted values. */
export function passwordErrorMessage(error: unknown, t: Translate, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback;
  const value = error as { code?: string; message?: string; reasons?: unknown };
  const reasons = Array.isArray(value.reasons) ? value.reasons : [];
  const message = typeof value.message === 'string' ? value.message : '';
  if (reasons.includes('pwned')) return t('ظهرت كلمة المرور هذه في تسريبات معروفة. اختر كلمة مرور مختلفة لم تستخدمها سابقاً.', 'This password appears in known data breaches. Choose a different password you have not used before.');
  if (value.code === 'same_password') return t('اختر كلمة مرور مختلفة عن كلمة المرور الحالية.', 'Choose a password different from your current password.');
  const minimum = message.match(/at least (\d+) characters/i);
  if (minimum) return t(`إعدادات أمان الحساب تتطلب ${minimum[1]} أحرف على الأقل.`, `Account security settings require at least ${minimum[1]} characters.`);
  if (reasons.includes('characters') || /password should contain/i.test(message)) return t('إعدادات أمان الحساب تتطلب أنواع أحرف إضافية. جرّب أحرفاً كبيرة وصغيرة وأرقاماً ورمزاً خاصاً.', 'Account security settings require additional character types. Try uppercase and lowercase letters, numbers and a symbol.');
  if (value.code === 'weak_password' || reasons.includes('length')) return t('رفضت إعدادات أمان الحساب كلمة المرور. جرّب عبارة أطول وفريدة؛ قد تتطلب الإعدادات أحرفاً أو رموزاً إضافية.', 'Account security settings rejected this password. Try a longer, unique passphrase; settings may require additional characters or symbols.');
  return fallback;
}

/** Seconds the owner/customer must wait before asking for another recovery link. */
export function resendSecondsLeft(
  lastSentAt: number | null,
  now: number,
  cooldownSeconds = RESEND_COOLDOWN_SECONDS,
) {
  if (!lastSentAt) return 0;
  const elapsed = Math.floor((now - lastSentAt) / 1000);
  return Math.min(cooldownSeconds, Math.max(0, cooldownSeconds - elapsed));
}

export function normalizeCode(value: string) {
  return value.replace(/[٠-٩۰-۹]/g, digit => {
    const code = digit.charCodeAt(0);
    return String(code >= 0x6f0 ? code - 0x6f0 : code - 0x660);
  }).replace(/\D/g, '').slice(0, 8);
}