import { useState, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { LanguageProvider, useLanguage } from '@/lib/language';
import { AdminGate, fieldClass, labelClass } from './AdminGate';
import { Button } from '@/components/ui/button';
import { readOrders, readAccounts, updateOrder, updateAccount, sendAccountReset } from '@/lib/management.functions';
import { statuses } from '@/lib/management-schema';

export function ManagementLayout({ children }: { children: ReactNode }) {
  return <LanguageProvider><AdminGate>{children}</AdminGate></LanguageProvider>;
}
const statusAr: Record<string, string> = { pending:'جديد',confirmed:'مؤكد',preparing:'قيد التجهيز',out_for_delivery:'قيد التوصيل',completed:'مكتمل',cancelled:'ملغي' };
export function useOrderData() {
  const fetch = useServerFn(readOrders);
  return useQuery({ queryKey: ['admin-orders'], queryFn: () => fetch() });
}
export function useAccountData() {
  const fetch = useServerFn(readAccounts);
  return useQuery({ queryKey: ['admin-accounts'], queryFn: () => fetch() });
}
function Feedback({ busy, error }: { busy: boolean; error: Error | null }) {
  const { t } = useLanguage();
  if (error) return <p role="alert" className="break-words text-destructive">{error.message}</p>;
  return busy ? <p role="status">{t('جارٍ التحميل…','Loading…')}</p> : null;
}
export function OrdersList({ search, status, from, to, archive, setSearch }: { search: string; status: string; from: string; to: string; archive: string; setSearch: (key: string, value: string) => void }) {
  const { t } = useLanguage();
  const query = useOrderData();
  const rows = query.data?.filter(o => `${o.order_number} ${o.customer_name} ${o.customer_phone}`.toLowerCase().includes(search.toLowerCase()) && (!status || o.status === status) && (!from || o.created_at.slice(0,10)>=from) && (!to || o.created_at.slice(0,10)<=to) && (archive === 'all' || o.archived === (archive === 'archived'))) ?? [];
  return <section className="space-y-6 min-w-0">
    <h1 className="font-display text-2xl">{t('الطلبات','Orders')}</h1>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <label className={labelClass}>{t('رقم الطلب / الاسم / الهاتف','Order / name / phone')}<input className={fieldClass} value={search} onChange={e=>setSearch('q',e.target.value)} /></label>
      <label className={labelClass}>{t('الحالة','Status')}<select className={fieldClass} value={status} onChange={e=>setSearch('status',e.target.value)}><option value="">{t('كل الحالات','All statuses')}</option>{statuses.map(s=><option key={s} value={s}>{t(statusAr[s],s.replaceAll('_',' '))}</option>)}</select></label>
      <label className={labelClass}>{t('من تاريخ','From')}<input type="date" className={`${fieldClass} min-w-0`} value={from} onChange={e=>setSearch('from',e.target.value)}/></label>
      <label className={labelClass}>{t('إلى تاريخ','To')}<input type="date" className={`${fieldClass} min-w-0`} value={to} onChange={e=>setSearch('to',e.target.value)}/></label>
      <label className={labelClass}>{t('الأرشيف','Archive')}<select className={fieldClass} value={archive} onChange={e=>setSearch('archive',e.target.value)}><option value="active">{t('الحالية','Current')}</option><option value="archived">{t('المؤرشفة','Archived')}</option><option value="all">{t('الكل','All')}</option></select></label>
    </div>
    <Feedback busy={query.isLoading} error={query.error}/>
    {!query.isLoading && !query.error && rows.length===0 && <p className="py-10 text-muted-foreground">{t('لا توجد طلبات مطابقة.','No matching orders.')}</p>}
    <ul className="divide-y divide-border">{rows.map(o=><li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-5">
      <div className="min-w-0 break-words"><Link className="inline-flex min-h-11 items-center font-medium text-primary underline" to="/admin/orders/$id" params={{id:o.id}}>#{o.order_number} · {o.customer_name}</Link><p dir="ltr" className="text-start text-sm text-muted-foreground">{o.customer_phone} · {o.created_at.slice(0,10)}</p></div>
      <div><p>{t(statusAr[o.status],o.status.replaceAll('_',' '))}</p><p className="text-primary">{Number(o.total).toFixed(2)} {t('د.أ','JOD')}</p></div>
    </li>)}</ul>
  </section>;
}
export function OrderDetail({ id }: { id:string }) {
  const query=useOrderData(); const { t }=useLanguage();
  const order=query.data?.find(o=>o.id===id);
  if (!order) return <><Feedback busy={query.isLoading} error={query.error}/>{!query.isLoading&&!query.error&&<p>{t('الطلب غير موجود','Order not found')}</p>}</>;
  return <OrderEditor key={`${id}-${order.updated_at}`} order={order}/>;
}
type Order = Awaited<ReturnType<typeof readOrders>>[number];
function OrderEditor({ order }: { order:Order }) {
  const { t }=useLanguage(); const qc=useQueryClient(); const save=useServerFn(updateOrder);
  const [status,setStatus]=useState(order.status); const [notes,setNotes]=useState(order.admin_notes); const [archived,setArchived]=useState(order.archived);
  const mutation=useMutation({mutationFn:()=>save({data:{id:order.id,status:status as typeof statuses[number],admin_notes:notes,archived}}),onSuccess:()=>{qc.invalidateQueries({queryKey:['admin-orders']});qc.invalidateQueries({queryKey:['admin-accounts']});}});
  return <section className="space-y-7 min-w-0">
    <Link to="/admin/orders" className="inline-flex min-h-11 items-center text-primary">{t('العودة للطلبات','Back to orders')}</Link>
    <h1 className="font-display text-2xl">{t('طلب','Order')} #{order.order_number}</h1>
    <dl className="grid gap-4 border-b border-border pb-6 sm:grid-cols-2">{[[t('العميل','Customer'),order.customer_name],[t('الهاتف','Phone'),order.customer_phone],[t('التوصيل / الاستلام','Delivery / pickup'),order.delivery_address],[t('ملاحظات العميل','Customer notes'),order.customer_notes],[t('التاريخ','Date'),new Date(order.created_at).toLocaleString()]].map(([k,v])=><div key={k}><dt className="text-sm text-muted-foreground">{k}</dt><dd className="break-words whitespace-pre-wrap">{v||'—'}</dd></div>)}</dl>
    <ul className="divide-y divide-border">{order.order_items.map(i=><li key={i.id} className="flex flex-wrap justify-between gap-3 py-4"><div className="min-w-0 break-words">{t(i.name_ar,i.name_en)}<p className="text-sm text-muted-foreground">{t('الكمية','Quantity')}: {i.quantity} · {t('المقاس','Size')}: {i.size||'—'}</p><p className="text-sm">{Number(i.unit_price).toFixed(2)} {t('د.أ للقطعة','JOD each')}</p></div><p>{(i.quantity*Number(i.unit_price)).toFixed(2)} {t('د.أ','JOD')}</p></li>)}</ul>
    <p className="text-xl font-semibold">{t('المجموع','Total')}: {Number(order.total).toFixed(2)} {t('د.أ','JOD')}</p>
    <form className="space-y-4 border-t border-border pt-6" onSubmit={e=>{e.preventDefault();mutation.mutate();}}>
      <label className={labelClass}>{t('حالة الطلب','Order status')}<select className={fieldClass} value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{t(statusAr[s],s.replaceAll('_',' '))}</option>)}</select></label>
      <label className={labelClass}>{t('ملاحظات الإدارة','Admin notes')}<textarea className={fieldClass} rows={4} maxLength={4000} value={notes} onChange={e=>setNotes(e.target.value)}/></label>
      <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={archived} onChange={e=>setArchived(e.target.checked)}/>{t('أرشفة الطلب','Archive order')}</label>
      <Button className="min-h-11" disabled={mutation.isPending} type="submit">{t('حفظ الطلب','Save order')}</Button>
      <Feedback busy={mutation.isPending} error={mutation.error}/>{mutation.isSuccess&&<p role="status">{t('تم الحفظ','Saved')}</p>}
    </form>
    <h2 className="text-lg">{t('سجل التغييرات','History')}</h2><ul>{[...order.order_events].sort((a,b)=>b.created_at.localeCompare(a.created_at)).map(e=><li key={e.id} className="border-b border-border py-3 text-sm break-words"><p>{new Date(e.created_at).toLocaleString()} · {t(statusAr[e.status]??e.status,e.status.replaceAll('_',' '))}</p><p>{e.note}</p></li>)}</ul>
  </section>;
}
export function AccountsList({ search, filter, setSearch }: { search:string;filter:string;setSearch:(key:string,value:string)=>void }) {
  const query=useAccountData(); const { t }=useLanguage();
  const rows=query.data?.filter(a=>`${a.email} ${a.full_name} ${a.phone}`.toLowerCase().includes(search.toLowerCase())&&(!filter||(filter==='suspended'?a.suspended:filter==='active'?!a.suspended:a.role===filter)))??[];
  return <section className="space-y-6 min-w-0"><h1 className="font-display text-2xl">{t('الحسابات','Accounts')}</h1>
    <div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>{t('الاسم / البريد / الهاتف','Name / email / phone')}<input className={fieldClass} value={search} onChange={e=>setSearch('q',e.target.value)}/></label><label className={labelClass}>{t('تصفية الحسابات','Filter accounts')}<select className={fieldClass} value={filter} onChange={e=>setSearch('filter',e.target.value)}>{[['','الكل','All'],['active','نشط','Active'],['suspended','معطل','Suspended'],['customer','عميل','Customer'],['staff','موظف','Staff'],['admin','أدمن','Admin']].map(([v,ar,en])=><option key={v} value={v}>{t(ar,en)}</option>)}</select></label></div>
    <Feedback busy={query.isLoading} error={query.error}/>
    {!query.isLoading&&!query.error&&rows.length===0&&<p>{t('لا توجد حسابات مطابقة','No matching accounts')}</p>}
    <ul className="divide-y divide-border">{rows.map(a=><li key={a.id} className="flex flex-wrap justify-between gap-3 py-5"><div className="min-w-0 break-words"><Link className="inline-flex min-h-11 items-center text-primary underline" to="/admin/accounts/$id" params={{id:a.id}}>{a.full_name||a.email}</Link><p className="break-all text-sm">{a.email}</p><p className="text-sm text-muted-foreground">{a.phone||'—'}</p></div><div className="text-sm"><p>{a.role} · {a.suspended?t('معطل','Suspended'):t('نشط','Active')}</p><p>{t('الطلبات','Orders')}: {a.orders.length}</p></div></li>)}</ul>
  </section>;
}
export function AccountDetail({ id }: { id:string }) {
  const query=useAccountData(); const { t }=useLanguage(); const account=query.data?.find(a=>a.id===id);
  if(!account)return <><Feedback busy={query.isLoading} error={query.error}/>{!query.isLoading&&!query.error&&<p>{t('الحساب غير موجود','Account not found')}</p>}</>;
  return <AccountEditor key={`${id}-${JSON.stringify(account)}`} account={account}/>;
}
type Account=Awaited<ReturnType<typeof readAccounts>>[number];
function AccountEditor({ account }: { account:Account }) {
  const { t }=useLanguage(); const qc=useQueryClient(); const save=useServerFn(updateAccount); const reset=useServerFn(sendAccountReset);
  const [form,setForm]=useState({id:account.id,email:account.email,full_name:account.full_name,phone:account.phone,suspended:account.suspended,role:account.role as 'customer'|'staff'|'admin'});
  const mutation=useMutation({mutationFn:()=>save({data:form}),onSuccess:()=>qc.invalidateQueries({queryKey:['admin-accounts']})});
  const resetMutation=useMutation({mutationFn:()=>reset({data:{id:account.id}})});
  return <section className="space-y-6 min-w-0"><Link to="/admin/accounts" className="inline-flex min-h-11 items-center text-primary">{t('العودة للحسابات','Back to accounts')}</Link><h1 className="text-2xl font-display break-words">{account.full_name||account.email}</h1>
    <p className="text-sm text-muted-foreground">{t('تاريخ التسجيل','Joined')}: {account.created_at.slice(0,10)}<br/>{t('آخر دخول','Last sign-in')}: {account.last_sign_in_at?new Date(account.last_sign_in_at).toLocaleString():'—'}</p>
    <form className="space-y-4" onSubmit={e=>{e.preventDefault(); if(window.confirm(t('حفظ تغييرات هذا الحساب؟','Save changes to this account?')))mutation.mutate();}}>
      {(['full_name','phone','email'] as const).map(k=><label key={k} className={labelClass}>{k==='full_name'?t('الاسم','Name'):k==='phone'?t('الهاتف','Phone'):t('البريد الإلكتروني','Email')}<input className={fieldClass} type={k==='email'?'email':'text'} dir={k==='full_name'?undefined:'ltr'} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}
      <label className={labelClass}>{t('الصلاحية','Role')}<select className={fieldClass} value={form.role} onChange={e=>setForm({...form,role:e.target.value as typeof form.role})}><option value="customer">{t('عميل','Customer')}</option><option value="staff">{t('موظف','Staff')}</option><option value="admin">{t('أدمن','Admin')}</option></select></label>
      <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={form.suspended} onChange={e=>setForm({...form,suspended:e.target.checked})}/>{t('تعطيل الحساب','Suspend account')}</label>
      <Button type="submit" className="min-h-11" disabled={mutation.isPending}>{t('حفظ الحساب','Save account')}</Button><Feedback busy={mutation.isPending} error={mutation.error}/>{mutation.isSuccess&&<p role="status">{t('تم الحفظ','Saved')}</p>}
    </form>
    <Button variant="outline" className="min-h-11 h-auto whitespace-normal" disabled={resetMutation.isPending} onClick={()=>{if(window.confirm(t('إرسال بريد إعادة تعيين كلمة المرور؟','Send password reset email?')))resetMutation.mutate();}}>{t('إرسال إعادة تعيين كلمة المرور','Send password reset email')}</Button><Feedback busy={resetMutation.isPending} error={resetMutation.error}/>{resetMutation.isSuccess&&<p role="status">{t('تم إرسال البريد','Email sent')}</p>}
    <h2 className="text-lg font-display">{t('طلبات العميل','Customer orders')}</h2><ul className="divide-y divide-border">{account.orders.map(o=><li className="py-3" key={o.id}><Link className="inline-flex min-h-11 flex-wrap items-center gap-3 text-primary" to="/admin/orders/$id" params={{id:o.id}}>#{o.order_number} · {o.created_at.slice(0,10)} · {Number(o.total).toFixed(2)} JOD</Link></li>)}</ul>{account.orders.length===0&&<p>{t('لا توجد طلبات','No orders')}</p>}
  </section>;
}