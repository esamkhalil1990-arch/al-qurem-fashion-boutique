import { describe, expect, it } from 'vitest';
import { normalizeCode, resendSecondsLeft } from './auth-input';

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