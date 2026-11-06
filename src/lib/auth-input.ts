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
export type CharRule = 'lower' | 'upper' | 'digit' | 'symbol';
export type PasswordPolicy = { minLength: number; chars: CharRule[] };
export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = { minLength: 6, chars: [] };
const POLICY_KEY = 'alqurem-password-policy';

/** Learn the hosted policy from a rejection message so the checklist mirrors real settings. */
export function policyFromError(error: unknown, current: PasswordPolicy): PasswordPolicy {
  const message = error && typeof error === 'object' && typeof (error as { message?: unknown }).message === 'string' ? (error as { message: string }).message : '';
  const chars = new Set(current.chars);
  if (/password should contain/i.test(message)) {
    if (message.includes('abcdefghijklmnopqrstuvwxyz')) chars.add('lower');
    if (message.includes('ABCDEFGHIJKLMNOPQRSTUVWXYZ')) chars.add('upper');
    if (message.includes('0123456789')) chars.add('digit');
    if (/[!@#$%^&*]/.test(message.split(/each:/i)[1] ?? '')) chars.add('symbol');
  }
  const min = message.match(/at least (\d+) characters/i);
  return { minLength: Math.max(current.minLength, min ? Number(min[1]) : 0), chars: (['lower', 'upper', 'digit', 'symbol'] as CharRule[]).filter(c => chars.has(c)) };
}

export function checkPassword(pw: string, policy: PasswordPolicy) {
  const tests: Record<CharRule, RegExp> = { lower: /[a-z]/, upper: /[A-Z]/, digit: /[0-9]/, symbol: /[^A-Za-z0-9\s]/ };
  return { length: [...pw].length >= policy.minLength, ...Object.fromEntries(policy.chars.map(c => [c, tests[c].test(pw)])) } as { length: boolean } & Partial<Record<CharRule, boolean>>;
}

export function loadPasswordPolicy(): PasswordPolicy {
  try { const v = JSON.parse(localStorage.getItem(POLICY_KEY) ?? 'null'); if (v && typeof v.minLength === 'number' && Array.isArray(v.chars)) return v; } catch { /* ignore */ }
  return DEFAULT_PASSWORD_POLICY;
}
export function savePasswordPolicy(p: PasswordPolicy) { try { localStorage.setItem(POLICY_KEY, JSON.stringify(p)); } catch { /* ignore */ } }
