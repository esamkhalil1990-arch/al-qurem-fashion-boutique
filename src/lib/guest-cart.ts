import { z } from 'zod';
export const guestItemSchema = z.object({ product_id: z.string().uuid(), size: z.string().max(100).nullable(), quantity: z.number().int().min(1).max(999) });
export type GuestItem = z.infer<typeof guestItemSchema>;
const key = 'alqurem-guest-cart';
export function readGuestCart(): GuestItem[] {
  if (typeof window === 'undefined') return [];
  try { return z.array(guestItemSchema).max(100).parse(JSON.parse(localStorage.getItem(key) ?? '[]')); } catch { return []; }
}
export function writeGuestCart(items: GuestItem[]) { localStorage.setItem(key, JSON.stringify(items)); }
export function addGuestItem(items: GuestItem[], product_id: string, size: string | null): GuestItem[] {
  const existing = items.find(i => i.product_id === product_id && i.size === size);
  if (existing) return items.map(i => i === existing ? { ...i, quantity: Math.min(999, i.quantity + 1) } : i);
  if (items.length >= 100) throw new Error('Cart is full');
  return [...items, guestItemSchema.parse({product_id, size, quantity: 1})];
}
export function normalizePhone(input: string) {
  let number = input.replace(/[٠-٩]/g, c => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[\s()-]/g, '');
  if (number.startsWith('00')) number = '+' + number.slice(2);
  if (/^07\d{8}$/.test(number)) number = '+962' + number.slice(1);
  if (/^9627\d{8}$/.test(number)) number = '+' + number;
  if (!/^\+[1-9]\d{7,14}$/.test(number)) throw new Error('Enter a valid phone number with country code');
  return number;
}