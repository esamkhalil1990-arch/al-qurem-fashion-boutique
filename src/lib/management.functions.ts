import { createServerFn, createMiddleware } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { accountUpdateSchema, assertAccountChange, checkoutSchema, orderUpdateSchema } from './management-schema';
import { z } from 'zod';

const requireAdmin = createMiddleware({ type: 'function' }).middleware([requireSupabaseAuth]).server(async ({ next, context }) => {
  const { data: active, error: activeError } = await context.supabase.rpc('is_account_active');
  const { data: admin, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (error || activeError || !active || !admin) throw new Error('Forbidden');
  return next({ context });
});

export const readOrders = createServerFn({ method: 'POST' }).middleware([requireAdmin]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from('orders').select('*,order_items(*),order_events(*)').order('created_at', { ascending: false });
  if (error) throw new Error('Unable to load orders');
  return data ?? [];
});
export const updateOrder = createServerFn({ method: 'POST' }).middleware([requireAdmin]).inputValidator(orderUpdateSchema).handler(async ({ context, data }) => {
  const { id, ...changes } = data;
  const { data: row, error } = await context.supabase.from('orders').update(changes).eq('id', id).select('id').single();
  if (error || !row) throw new Error('Unable to save order');
  return { ok: true };
});
export const placeOrder = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(checkoutSchema).handler(async ({ context, data }) => {
  const { data: id, error } = await context.supabase.rpc('checkout_cart', { _name: data.name, _phone: data.phone, _address: data.address, _notes: data.notes, _request_id: data.requestId });
  if (error) throw new Error('Unable to place order. Check your cart and delivery details.');
  const { data: order, error: readError } = await context.supabase.from('orders').select('*,order_items(*)').eq('id', id).single();
  if (readError || !order) throw new Error('Unable to read order confirmation');
  return order;
});
export const readAccounts = createServerFn({ method: 'POST' }).middleware([requireAdmin]).handler(async () => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const users = [];
  for (let page = 1; ; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error('Unable to load accounts');
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  const [profiles, roles, controls, orders] = await Promise.all([
    supabaseAdmin.from('profiles').select('*'), supabaseAdmin.from('user_roles').select('*'),
    supabaseAdmin.from('account_controls').select('*'), supabaseAdmin.from('orders').select('id,user_id,order_number,total,status,created_at'),
  ]);
  if (profiles.error || roles.error || controls.error || orders.error) throw new Error('Unable to load customer details');
  return users.map(u => ({ id: u.id, email: u.email ?? '', created_at: u.created_at, last_sign_in_at: u.last_sign_in_at ?? null,
    full_name: profiles.data?.find(p => p.id === u.id)?.full_name ?? String(u.user_metadata?.full_name ?? ''),
    phone: profiles.data?.find(p => p.id === u.id)?.phone ?? '',
    suspended: controls.data?.some(c => c.user_id === u.id && c.suspended) ?? false,
    role: roles.data?.some(r => r.user_id === u.id && r.role === 'admin') ? 'admin' : roles.data?.some(r => r.user_id === u.id && r.role === 'staff') ? 'staff' : 'customer',
    orders: orders.data?.filter(o => o.user_id === u.id) ?? [],
  }));
});
export const updateAccount = createServerFn({ method: 'POST' }).middleware([requireAdmin]).inputValidator(accountUpdateSchema).handler(async ({ context, data }) => {
  assertAccountChange(context.userId, data.id, data.suspended, data.role);
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: existing, error: findError } = await supabaseAdmin.auth.admin.getUserById(data.id);
  if (findError || !existing.user) throw new Error('Account not found');
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(data.id, { email: data.email, ban_duration: data.suspended ? '876000h' : 'none' });
  if (authError) throw new Error('Unable to update sign-in account');
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({ id: data.id, full_name: data.full_name, phone: data.phone });
  const { error: controlError } = await supabaseAdmin.from('account_controls').upsert({ user_id: data.id, suspended: data.suspended, updated_at: new Date().toISOString() });
  if (profileError || controlError) throw new Error('Account partially updated; refresh and retry.');
  const { error: rolesError } = await supabaseAdmin.from('user_roles').delete().eq('user_id', data.id);
  if (rolesError) throw new Error('Unable to update roles');
  if (data.role !== 'customer') {
    const { error } = await supabaseAdmin.from('user_roles').insert({ user_id: data.id, role: data.role });
    if (error) throw new Error('Unable to grant role');
  }
  return { ok: true };
});
export const sendAccountReset = createServerFn({ method: 'POST' }).middleware([requireAdmin]).inputValidator(z.object({ id: z.string().uuid() })).handler(async ({ data }) => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: result, error } = await supabaseAdmin.auth.admin.getUserById(data.id);
  if (error || !result.user?.email) throw new Error('Account not found');
  const { error: sendError } = await supabaseAdmin.auth.resetPasswordForEmail(result.user.email);
  if (sendError) throw new Error('Unable to send reset email');
  return { ok: true };
});