import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { normalizePhone } from '@/lib/guest-cart';
import { useLanguage } from '@/lib/language';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LoaderCircle, MessageSquare } from 'lucide-react';
import { normalizeCode } from '@/lib/auth-input';
import { SecretInput, signInFieldClass } from './SecretInput';

export function PhoneSignIn({ onSuccess, onBusyChange }: { onSuccess: () => void; onBusyChange?: (busy: boolean) => void }) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!seconds) return;
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  function markBusy(value: boolean) { setBusy(value); onBusyChange?.(value); }

  async function send() {
    if (busy || seconds > 0) return;
    setError(''); setNotice('');
    let normalized: string;
    try { normalized = normalizePhone(phone); }
    catch { setError(t('أدخل رقم هاتف صحيحاً، مثل 0782116684، أو رقماً مع رمز الدولة.', 'Enter a valid phone number, such as 0782116684, or include the country code.')); return; }
    markBusy(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({ phone: normalized });
      if (authError) throw authError;
      setPhone(normalized); setSent(true); setCode(''); setSeconds(60);
      setNotice(t('تم إرسال رمز الدخول.', 'Your sign-in code was sent.'));
    } catch (err) {
      const status = err && typeof err === 'object' && 'status' in err ? err.status : undefined;
      if (status === 429) {
        setSeconds(60);
        setError(t('طلبات كثيرة. انتظر قليلاً ثم أعد المحاولة.', 'Too many requests. Please wait before trying again.'));
      } else {
        setError(t('تعذر إرسال الرمز. خدمة رسائل الدخول غير متاحة حالياً؛ يمكنك متابعة التسوق أو الدخول بحساب البريد الحالي.', 'The code could not be sent. SMS sign-in is currently unavailable; you can continue shopping or use an existing email account.'));
      }
    } finally { markBusy(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!sent) { await send(); return; }
    setError(''); setNotice(''); markBusy(true);
    try {
      const { error: authError } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });
      if (authError) throw authError;
      onSuccess();
    } catch {
      setError(t('تعذر التحقق. تأكد من الرمز واتصالك، أو اطلب رمزاً جديداً إذا انتهت صلاحيته.', 'Unable to verify. Check the code and your connection, or request a new code if it expired.'));
    } finally { markBusy(false); }
  }

  return <form onSubmit={submit} className="space-y-5" aria-busy={busy}>
    {sent ? <div className="space-y-2">
      <p className="flex items-center gap-2 text-sm text-muted-foreground"><MessageSquare className="size-4 shrink-0" aria-hidden="true" />{t('الرمز المُرسل إلى', 'Code sent to')}</p>
      <p className="font-medium" dir="ltr">{phone}</p>
      <Button type="button" variant="link" disabled={busy} className="h-auto min-h-11 px-0" onClick={() => { setSent(false); setCode(''); setError(''); setNotice(''); }}><ArrowLeft className="rtl:rotate-180" />{t('تغيير الرقم', 'Change number')}</Button>
      <label htmlFor="phone-code" className="block text-sm font-medium">{t('رمز التحقق', 'Verification code')}</label>
      <SecretInput key="code" id="phone-code" autoFocus dir="ltr" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{4,8}" maxLength={8} required disabled={busy} value={code} onChange={e => setCode(normalizeCode(e.target.value))} aria-describedby={error ? 'phone-error' : undefined} aria-invalid={!!error} />
    </div> : <div className="space-y-2">
      <label htmlFor="sign-in-phone" className="block text-sm font-medium">{t('رقم الهاتف', 'Phone number')}</label>
      <input id="sign-in-phone" type="tel" autoComplete="tel" dir="ltr" required disabled={busy} placeholder="07XXXXXXXX" value={phone} onChange={e => { setPhone(e.target.value); setError(''); }} className={signInFieldClass} aria-describedby={error ? 'phone-error' : undefined} aria-invalid={!!error} />
    </div>}
    {error && <p id="phone-error" role="alert" className="break-words border-s-2 border-destructive ps-3 text-sm text-destructive">{error}</p>}
    {notice && <p role="status" className="text-sm text-primary">{notice}</p>}
    <Button type="submit" className="h-auto min-h-12 w-full whitespace-normal" disabled={busy || (!sent && seconds > 0)}>
      {busy && <LoaderCircle className="motion-safe:animate-spin" aria-hidden="true" />}
      {busy ? t('لحظات...', 'One moment...') : sent ? t('تحقق وتابع', 'Verify and continue') : t('إرسال رمز الدخول', 'Send sign-in code')}
    </Button>
    {seconds > 0 && !sent && <p role="status" className="text-sm text-muted-foreground">{t('يمكنك المحاولة بعد', 'Try again in')} {seconds} {t('ثانية', 'seconds')}</p>}
    {sent && <Button type="button" variant="link" className="min-h-11" disabled={busy || seconds > 0} onClick={() => void send()}>{t('إعادة الإرسال', 'Resend code')}{seconds > 0 ? ` (${seconds})` : ''}</Button>}
  </form>;
}