import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/site/PageLayout";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/shop";
import { useQueryClient } from "@tanstack/react-query";
import { PhoneSignIn } from "@/components/site/PhoneSignIn";
import { SecretInput, signInFieldClass } from '@/components/site/SecretInput';
import { resendSecondsLeft } from '@/lib/auth-input';
import { LoaderCircle, Mail, MailCheck, Phone } from 'lucide-react';

type Mode = "login" | "signup" | "reset" | "forgot" | "sent";

export const Route = createFileRoute("/login")({
  validateSearch:(s:Record<string,unknown>):{next?:string;intent?:'forgot'}=>({
    ...(s["next"]==="cart"?{next:"cart" as const}:{}),
    ...(s["intent"]==="forgot"?{intent:"forgot" as const}:{}),
  }),
  head: () => ({
    meta: [
      { title: "Sign In — تسجيل الدخول | AL-Qurem Fashion" },
      { name: "description", content: "Sign in or create an account at AL-Qurem Fashion." },
      { property: "og:title", content: "Sign In — تسجيل الدخول | AL-Qurem Fashion" },
      { property: "og:description", content: "Sign in or create an account at AL-Qurem Fashion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginContent() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const qc = useQueryClient();
  const {next, intent}=Route.useSearch();
  const [ownerLogin,setOwnerLogin]=useState(intent==='forgot');
  const [phoneBusy, setPhoneBusy] = useState(false);
  const [mode, setMode] = useState<Mode>(intent==='forgot'?'forgot':'login');
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') { setMode('reset'); setOwnerLogin(true); }
    });
    if (window.location.hash.includes('type=recovery')) { setMode('reset'); setOwnerLogin(true); }
    return () => data.subscription.unsubscribe();
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const [sentEmail, setSentEmail] = useState("");
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const secondsLeft = resendSecondsLeft(sentAt, now);
  useEffect(() => {
    if (mode !== 'sent' || !sentAt || secondsLeft === 0) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [mode, sentAt, secondsLeft]);

  function openSent(target: string) {
    const at = Date.now();
    setSentEmail(target);
    setSentAt(at);
    setNow(at);
    setMessage(null);
    setMode('sent');
  }

  async function resendLink() {
    if (busy || secondsLeft > 0 || !sentEmail) return;
    setBusy(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(sentEmail, { redirectTo: `${window.location.origin}/reset-password` });
      if (error) throw error;
      const at = Date.now();
      setSentAt(at);
      setNow(at);
      setMessage({ kind: 'ok', text: t('أرسلنا رابطاً جديداً إلى بريدك. تفقد بريدك أو مجلد الرسائل غير المرغوبة.', 'We sent a new link to your email. Check your inbox and spam folder.') });
    } catch {
      setMessage({ kind: 'error', text: t('تعذر إرسال رابط جديد الآن. انتظر قليلاً ثم حاول مرة أخرى.', 'Unable to send a new link right now. Wait a moment and try again.') });
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      if (mode === 'forgot') {
        const target = email.trim();
        const { error } = await supabase.auth.resetPasswordForEmail(target, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        openSent(target);
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage({ kind: 'ok', text: t('تم تغيير كلمة المرور','Password updated') });
        setMode('login');
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: next==="cart"?"/cart":"/" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: next==="cart"?"/cart":"/" });
        } else {
          setMessage({
            kind: "ok",
            text: t(
              "تم إنشاء الحساب! تفقد بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.",
              "Account created! Check your email to confirm your account, then sign in.",
            ),
          });
          setMode("login");
        }
      }
    } catch (err) {
      setMessage({
        kind: "error",
        text:
          mode === 'login'
            ? t('تعذر الدخول. تحقق من البريد وكلمة المرور وتأكيد الحساب ثم حاول مرة أخرى.', 'Unable to sign in. Check your email, password and account confirmation, then try again.')
            : mode === 'forgot'
              ? t('تعذر إرسال رابط إعادة التعيين. تحقق من البريد واتصالك بالإنترنت ثم حاول مرة أخرى.', 'Unable to send the reset link. Check your email and internet connection, then try again.')
              : t('تعذر إكمال الطلب. تحقق من البيانات واتصالك ثم حاول مرة أخرى.', 'Unable to complete your request. Check your details and connection, then try again.'),
      });
    } finally {
      setBusy(false);
    }
  }

  function changeMode(value: Mode) { setMode(value); setPassword(''); setMessage(null); }
  if (loading) return <div role="status" className="mx-auto flex max-w-md justify-center py-16"><LoaderCircle className="size-6 motion-safe:animate-spin" aria-label={t('جارٍ التحميل', 'Loading')} /></div>;
  if (user && (mode === 'login' || mode === 'signup')) return <div className="mx-auto max-w-md space-y-5 px-5 pb-24 sm:px-8"><h1 className="text-3xl font-display">{t('حسابي', 'My account')}</h1><p className="break-all" dir="ltr">{user.phone||user.email}</p><Button asChild variant="outline"><a href={next==="cart"?"/cart":"/"}>{t('تابع التسوق', 'Continue shopping')}</a></Button><Button asChild variant="outline"><a href="/orders">{t("طلباتي","My orders")}</a></Button><Button disabled={busy} onClick={async () => { setBusy(true); await qc.cancelQueries(); qc.clear(); const { error } = await supabase.auth.signOut(); setBusy(false); if (error) { setMessage({kind:'error',text:t('تعذر تسجيل الخروج. حاول مرة أخرى.', 'Unable to sign out. Please try again.')}); return; } navigate({to:'/login',replace:true}); }}>{t('تسجيل الخروج', 'Sign out')}</Button>{message?.kind==='error' && <p role="alert" className="text-destructive">{message.text}</p>}</div>;

  return (
    <div className="mx-auto max-w-md px-5 pb-20 pt-6 sm:px-8">
      <h1 className="font-display text-2xl sm:text-3xl">{mode === 'reset' || mode === 'forgot' ? t('إعادة تعيين كلمة المرور', 'Reset password') : mode === 'sent' ? t('تم إرسال الرابط', 'Link sent') : mode === 'signup' ? t('إنشاء حساب', 'Create account') : t('تسجيل الدخول', 'Sign in')}</h1>
      {next === 'cart' && <p className="mt-3 text-sm text-muted-foreground">{t('سجّل الدخول لإتمام طلبك. منتجات سلتك محفوظة.', 'Sign in to complete your order. Your cart is saved.')}</p>}
      {mode !== 'reset' && mode !== 'sent' && <div role="group" aria-label={t('طريقة الدخول', 'Sign-in method')} className="mt-6 grid grid-cols-2 gap-1 border-b border-border pb-3">
        <Button type="button" disabled={busy || phoneBusy} variant={ownerLogin ? 'ghost' : 'default'} aria-pressed={!ownerLogin} className="h-auto min-h-12 whitespace-normal" onClick={() => { setOwnerLogin(false); changeMode('login'); }}><Phone />{t('رقم الهاتف', 'Phone')}</Button>
        <Button type="button" disabled={busy || phoneBusy} variant={ownerLogin ? 'default' : 'ghost'} aria-pressed={ownerLogin} className="h-auto min-h-12 whitespace-normal" onClick={() => { setOwnerLogin(true); changeMode('login'); }}><Mail />{t('البريد الإلكتروني', 'Email')}</Button>
      </div>}
      <div key={`${ownerLogin}-${mode}`} className="sign-in-panel mt-6">
      {mode === 'sent' ? <div className="space-y-5">
        <div role="status" className="flex items-start gap-3 rounded-md border border-primary/25 bg-primary/5 p-4">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0 space-y-1.5">
            <p className="font-medium">{t('تم إرسال رابط إعادة التعيين إلى بريدك.', 'We sent a password reset link to your email.')}</p>
            <p className="break-all text-sm" dir="ltr">{sentEmail}</p>
            <p className="text-sm text-muted-foreground">{t('يصل الرابط عادةً خلال دقائق. إن لم يصلك، تفقد مجلد الرسائل غير المرغوبة أو غير المؤهّلة.', 'The link usually arrives within a few minutes. If it does not, check your spam or junk folder.')}</p>
          </div>
        </div>
        {message && <p role={message.kind === 'error' ? 'alert' : 'status'} className={`break-words text-sm ${message.kind === 'error' ? 'text-destructive' : 'text-primary'}`}>{message.text}</p>}
        <Button type="button" onClick={resendLink} disabled={busy || secondsLeft > 0} className="h-auto min-h-12 w-full whitespace-normal">
          {busy && <LoaderCircle className="motion-safe:animate-spin" aria-hidden="true" />}
          {secondsLeft > 0 ? t(`يمكنك طلب رابط جديد بعد ${secondsLeft} ثانية`, `You can request a new link in ${secondsLeft}s`) : t('إرسال رابط جديد', 'Send a new link')}
        </Button>
        <Button type="button" variant="link" className="min-h-11 w-full whitespace-normal" disabled={busy} onClick={() => changeMode('login')}>{t('العودة إلى تسجيل الدخول', 'Back to sign in')}</Button>
      </div> : !ownerLogin && mode !== 'reset' ? <PhoneSignIn onBusyChange={setPhoneBusy} onSuccess={() => navigate({ to: next === 'cart' ? '/cart' : '/' })} /> : <>
      <form onSubmit={onSubmit} className="space-y-5" aria-busy={busy}>
        {mode === "signup" && (
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm">
              {t("الاسم الكامل", "Full name")}
            </label>
            <input
              autoComplete="name"
              disabled={busy}
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={signInFieldClass}
            />
          </div>
        )}
        {mode !== 'reset' && <div>
          <label htmlFor="email" className="mb-1.5 block text-sm">
            {t("البريد الإلكتروني", "Email")}
          </label>
          <input
            id="email"
            autoComplete="email"
            disabled={busy}
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={signInFieldClass}
          />
        </div>}
        {mode !== 'forgot' && <div>
          <label htmlFor="password" className="mb-1.5 block text-sm">
            {t("كلمة المرور", "Password")}
          </label>
          <SecretInput
            key={mode}
            id="password"
            disabled={busy}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={6}
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={signInFieldClass}
          />
        </div>}

        {message && (
          <p role={message.kind === "error" ? "alert" : "status"} className={`break-words text-sm ${message.kind === "error" ? "text-destructive" : "text-primary"}`}>
            {message.text}
          </p>
        )}

        <Button
          type="submit"
          disabled={busy}
          className="h-auto min-h-12 w-full whitespace-normal"
        >
          {busy && <LoaderCircle className="motion-safe:animate-spin" aria-hidden="true" />}
          {busy
            ? t("لحظات...", "One moment...")
            : mode === 'forgot' ? t('إرسال رابط إعادة التعيين', 'Send reset link') : mode === 'reset' ? t('حفظ كلمة المرور','Save password') : mode === "login"
              ? t("دخول", "Sign In")
              : t("إنشاء الحساب", "Create Account")}
        </Button>
      </form>
      {mode==='login' && <Button variant="link" className="mt-3 min-h-11" disabled={busy} onClick={() => changeMode('forgot')}>{t('نسيت كلمة المرور؟', 'Forgot password?')}</Button>}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            {t("ليس لديك حساب؟", "Don't have an account?")}{" "}
            <Button disabled={busy} type="button" variant="link" onClick={() => changeMode('signup')} className="h-auto min-h-11 px-1">
              {t("إنشاء حساب", "Create one")}
            </Button>
          </>
        ) : (
          <>
            {t("لديك حساب؟", "Already have an account?")}{" "}
            <Button disabled={busy} type="button" variant="link" onClick={() => changeMode('login')} className="h-auto min-h-11 px-1">
              {t("تسجيل الدخول", "Sign in")}
            </Button>
          </>
        )}
      </p>
      </>}
      </div>
      {mode !== 'reset' && mode !== 'sent' && <Button asChild variant="link" className="mt-5 h-auto min-h-11 w-full whitespace-normal"><Link to={next === 'cart' ? '/cart' : '/'}>{t('متابعة التسوق دون تسجيل الدخول', 'Continue shopping without signing in')}</Link></Button>}
    </div>
  );
}

function LoginPage() {
  return (
    <PageLayout>
      <LoginContent />
    </PageLayout>
  );
}
