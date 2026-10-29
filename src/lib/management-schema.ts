import { z } from 'zod';
export const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'] as const;
export const orderUpdateSchema = z.object({ id: z.string().uuid(), status: z.enum(statuses), admin_notes: z.string().max(4000), archived: z.boolean() });
export const accountUpdateSchema = z.object({ id: z.string().uuid(), full_name: z.string().max(150), phone: z.string().max(40), email: z.string().email(), suspended: z.boolean(), role: z.enum(['customer', 'staff', 'admin']) });
export function assertAccountChange(actor: string, target: string, suspended: boolean, role: string) {
  if (actor === target && (suspended || role !== 'admin')) throw new Error('You cannot suspend yourself or remove your own admin access.');
}
export const checkoutSchema = z.object({ name: z.string().trim().min(2).max(150), phone: z.string().trim().min(7).max(40), address: z.string().trim().min(3).max(1000), notes: z.string().max(2000), requestId: z.string().uuid() });