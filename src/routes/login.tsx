import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/site/PageLayout";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — تسجيل الدخول | AL-Qurem Fashion" },
      { name: "description", content: "Sign in or create an account at AL-Qurem Fashion." },
    ],
  }),
  component: LoginPage,
});

function LoginContent() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").upsert({ id: data.user.id, full_name: fullName });
        }
        if (data.session) {
          navigate({ to: "/" });
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
          err instanceof Error && err.message
            ? err.message
            : t("حدث خطأ، حاول مرة أخرى.", "Something went wrong, please try again."),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-24 sm:px-8">
      <h1 className="text-center font-display text-3xl font-semibold tracking-tight">
        {mode === "login" ? t("تسجيل الدخول", "Sign In") : t("إنشاء حساب", "Create Account")}
      </h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        {t("ادخل بريدك الإلكتروني وكلمة المرور", "Enter your email and password")}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm">
              {t("الاسم الكامل", "Full name")}
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm">
            {t("البريد الإلكتروني", "Email")}
          </label>
          <input
            id="email"
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm">
            {t("كلمة المرور", "Password")}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {message && (
          <p className={`text-sm ${message.kind === "error" ? "text-destructive" : "text-primary"}`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-primary px-6 py-3.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {busy
            ? t("لحظات...", "One moment...")
            : mode === "login"
              ? t("دخول", "Sign In")
              : t("إنشاء الحساب", "Create Account")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            {t("ليس لديك حساب؟", "Don't have an account?")}{" "}
            <button type="button" onClick={() => setMode("signup")} className="text-primary underline">
              {t("إنشاء حساب", "Create one")}
            </button>
          </>
        ) : (
          <>
            {t("لديك حساب؟", "Already have an account?")}{" "}
            <button type="button" onClick={() => setMode("login")} className="text-primary underline">
              {t("تسجيل الدخول", "Sign in")}
            </button>
          </>
        )}
      </p>
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
