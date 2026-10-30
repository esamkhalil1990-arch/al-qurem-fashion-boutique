import { describe, it, expect } from 'vitest';
import { assertAccountChange, checkoutSchema, orderUpdateSchema, accountUpdateSchema } from './management-schema';
describe('Administrative rules', () => {
  it('cannot remove own admin access', () => { expect(()=>assertAccountChange('owner','owner',false,'customer')).toThrow(); });
  it('cannot suspend own account', () => { expect(()=>assertAccountChange('owner','owner',true,'admin')).toThrow(); });
  it('can manage other customers', () => { expect(()=>assertAccountChange('owner','customer',true,'customer')).not.toThrow(); });
  it('accepts only supported order states', () => { expect(orderUpdateSchema.safeParse({id:'e10020b5-15ef-4854-829a-ae397a7a1332',status:'paid',admin_notes:'',archived:false}).success).toBe(false); });
  it('rejects client totals and requires delivery identity', () => { const parsed=checkoutSchema.safeParse({name:'',phone:'',address:'',notes:'',requestId:'e10020b5-15ef-4854-829a-ae397a7a1332',total:0});expect(parsed.success).toBe(false); });
  it('rejects arbitrary privileged roles', () => { expect(accountUpdateSchema.safeParse({id:'e10020b5-15ef-4854-829a-ae397a7a1332',full_name:'Owner',phone:'0782116684',email:'owner@example.com',suspended:false,role:'superadmin'}).success).toBe(false); });
});