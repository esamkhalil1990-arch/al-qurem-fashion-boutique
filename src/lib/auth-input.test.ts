import { describe, expect, it } from 'vitest';
import { normalizeCode } from './auth-input';

describe('Verification code input', () => {
  it('accepts Arabic and Persian keypad digits', () => {
    expect(normalizeCode('١٢٣۴۵۶')).toBe('123456');
  });
  it('removes pasted separators without losing digits', () => {
    expect(normalizeCode('12 34-56')).toBe('123456');
    expect(normalizeCode('a123456789')).toBe('12345678');
  });
});