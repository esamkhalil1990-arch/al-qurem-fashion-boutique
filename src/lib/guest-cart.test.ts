import { describe, it, expect } from 'vitest';
import { addGuestItem, normalizePhone, guestItemSchema } from './guest-cart';
const id='e10020b5-15ef-4854-829a-ae397a7a1332';
describe('Guest shopping',()=>{
  it('allows adding without an account',()=>expect(addGuestItem([],id,null)).toEqual([{product_id:id,size:null,quantity:1}]));
  it('increments matching products and preserves separate sizes',()=>{const rows=addGuestItem(addGuestItem([],id,'M'),id,'M');expect(rows[0]?.quantity).toBe(2);expect(addGuestItem(rows,id,'L')).toHaveLength(2);});
  it('rejects invalid checkout quantities',()=>expect(guestItemSchema.safeParse({product_id:id,size:null,quantity:0}).success).toBe(false));
  it('normalizes Jordanian phone numbers',()=>{expect(normalizePhone('0782116684')).toBe('+962782116684');expect(normalizePhone('٠٧٨٢١١٦٦٨٤')).toBe('+962782116684');});
});