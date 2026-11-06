import { describe, expect, it } from 'vitest';
import { normalizeCode, passwordErrorMessage, resendSecondsLeft } from './auth-input';

describe('Hosted password rejection reasons', () => {
  const t = (_ar: string, en: string) => en;
  it('explains breached passwords without recommending weaker security', () => {
    expect(passwordErrorMessage({ code: 'weak_password', reasons: ['pwned'] }, t, 'fallback')).toBe('This password appears in known data breaches. Choose a different password you have not used before.');
  });
  it('uses the minimum actually reported by account security', () => {
    expect(passwordErrorMessage({ code: 'weak_password', message: 'Password should be at least 12 characters.' }, t, 'fallback')).toBe('Account security settings require at least 12 characters.');
  });
  it('distinguishes required character types from other failures', () => {
    expect(passwordErrorMessage({ code: 'weak_password', reasons: ['characters'] }, t, 'fallback')).toBe('Account security settings require additional character types. Try uppercase and lowercase letters, numbers and a symbol.');
    expect(passwordErrorMessage({ code: 'network_error' }, t, 'Connection failed')).toBe('Connection failed');
  });
  it('does not echo provider messages or submitted secrets', () => {
    expect(passwordErrorMessage({ message: 'private provider detail', code: 'weak_password' }, t, 'fallback')).not.toContain('private provider detail');
  });
});

describe('Verification code input', () => {
  it('accepts Arabic and Persian keypad digits', () => {
    expect(normalizeCode('١٢٣۴۵۶')).toBe('123456');
  });
  it('removes pasted separators without losing digits', () => {
    expect(normalizeCode('12 34-56')).toBe('123456');
    expect(normalizeCode('a123456789')).toBe('12345678');
  });
});

describe('Recovery link resend cooldown', () => {
  it('blocks a second request until 30 seconds have passed', () => {
    expect(resendSecondsLeft(1000, 1000)).toBe(30);
    expect(resendSecondsLeft(1000, 1000 + 12_000)).toBe(18);
    expect(resendSecondsLeft(1000, 1000 + 29_000)).toBe(1);
    expect(resendSecondsLeft(1000, 1000 + 30_000)).toBe(0);
    expect(resendSecondsLeft(1000, 1000 + 90_000)).toBe(0);
  });
  it('allows the first request and never counts above the cooldown', () => {
    expect(resendSecondsLeft(null, 5000)).toBe(0);
    expect(resendSecondsLeft(9000, 8000)).toBe(30);
  });
});