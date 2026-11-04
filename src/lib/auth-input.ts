export const RESEND_COOLDOWN_SECONDS = 30;

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