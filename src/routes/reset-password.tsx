import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { LoaderCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PageLayout } from '@/components/site/PageLayout';
import { SecretInput } from '@/components/site/SecretInput';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';
import { passwordErrorMessage } from '@/lib/auth-input';

export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [
    { title: 'Reset Password — إعادة تعيين كلمة المرور | AL-Qurem Fashion' },
    { name: 'description', content: 'Securely reset your AL-Qurem Fashion account password.' },
    { property: 'og:title', content: 'Reset Password | AL-Qurem Fashion' },
    { property: 'og:description', content: 'Securely reset your AL-Qurem Fashion account password.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: () => <PageLayout><ResetPassword /></PageLayout>,
});

function ResetPassword() {
  const { t } = useLanguage();
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') setValid(true);
    });
    if (new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery') setValid(true);
    return () => data.subscription.unsubscribe();
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!valid || busy) return;
    setBusy(true); setError('');
    try {
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      setSaved(true); setPassword('');
    } catch (err) { setError(passwordErrorMessage(err, t, t('تعذر حفظ كلمة المرور. تأكد من صلاحية رابط الاستعادة وحاول مجدداً.', 'Unable to save your password. Check that your recovery link is still valid and try again.'))); }
    finally { setBusy(false); }
  }
  return <div className="mx-auto max-w-md space-y-6 px-5 pb-20 pt-6 sm:px-8">
    <h1 className="font-display text-2xl">{t('إعادة تعيين كلمة المرور', 'Reset password')}</h1>
    {saved ? <p role="status">{t('تم حفظ كلمة المرور الجديدة.', 'Your new password has been saved.')}</p> : valid ? <form onSubmit={submit} className="space-y-5" aria-busy={busy}>
      <label htmlFor="new-password" className="block text-sm">{t('كلمة المرور الجديدة', 'New password')}</label>
      <SecretInput id="new-password" autoComplete="new-password" dir="ltr" minLength={6} required value={password} disabled={busy} onChange={e => setPassword(e.target.value)} />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy} className="h-auto min-h-12 w-full whitespace-normal">{busy && <LoaderCircle className="motion-safe:animate-spin" />}{t('حفظ كلمة المرور', 'Save password')}</Button>
    </form> : <div className="space-y-4"><p role="status" className="text-muted-foreground">{t('افتح رابط استعادة كلمة المرور من بريدك. إن لم يصلك، اطلب رابطاً جديداً.', 'Open the recovery link from your email. If it did not arrive, request a new one.')}</p><Button asChild variant="outline" className="h-auto min-h-12 w-full whitespace-normal"><Link to="/login" search={{ intent: 'forgot' as const }}>{t('طلب رابط جديد', 'Request a new link')}</Link></Button></div>}
    <Button asChild variant="link" className="min-h-11"><Link to="/login">{t('العودة إلى تسجيل الدخول', 'Back to sign in')}</Link></Button>
  </div>;
}