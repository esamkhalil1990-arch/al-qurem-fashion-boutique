import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageLayout } from "@/components/site/PageLayout";
import { SecretInput } from "@/components/site/SecretInput";
import { useLanguage } from "@/lib/language";
import { useSession } from "@/lib/shop";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordErrorMessage } from '@/lib/auth-input';
import { PasswordChecklist, usePasswordPolicy } from '@/components/site/PasswordChecklist';

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — حسابي | AL-Qurem Fashion" },
      { name: "description", content: "Update your name, address and password at AL-Qurem Fashion." },
      { property: "og:title", content: "My account | AL-Qurem Fashion" },
      { property: "og:description", content: "Manage your AL-Qurem Fashion account details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <PageLayout>
      <AccountPage />
    </PageLayout>
  ),
});

function AccountPage() {
  const { t } = useLanguage();
  const { user, loading } = useSession();
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
        if (!user) return null;
        const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [infoMsg, setInfoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [savingPw, setSavingPw] = useState(false);
  const pp = usePasswordPolicy();

  useEffect(() => {
    if (profile.isSuccess) {
      setName(profile.data?.full_name ?? "");
      setAddress(profile.data?.address ?? "");
    }
  }, [profile.isSuccess, profile.data]);

  if (loading) return <p role="status" className="px-5 py-10 text-center">{t("جارٍ التحميل...", "Loading...")}</p>;
  if (!user)
    return (
      <section className="mx-auto max-w-xl px-5 pb-24 text-center">
        <p className="mb-4">{t("سجّل الدخول لتعديل بيانات حسابك.", "Sign in to edit your account.")}</p>
        <Button asChild><Link to="/login" search={{}}>{t("تسجيل الدخول", "Sign in")}</Link></Button>
      </section>
    );

  const saveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    setInfoMsg(null);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: name.trim() || null, address: address.trim() || null });
    setSavingInfo(false);
    if (error) setInfoMsg({ ok: false, text: t("تعذر حفظ البيانات.", "Could not save your details.") });
    else {
      setInfoMsg({ ok: true, text: t("تم حفظ بياناتك.", "Your details were saved.") });
      qc.invalidateQueries({ queryKey: ["my-profile"] });
    }
  };

  const savePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (!pp.met(pw)) return setPwMsg({ ok: false, text: t("كلمة المرور لا تستوفي كل الشروط في القائمة.", "Your password doesn't meet every requirement in the list.") });
    if (pw !== pw2) return setPwMsg({ ok: false, text: t("كلمتا المرور غير متطابقتين.", "Passwords do not match.") });
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSavingPw(false);
    if (error) pp.learn(error);
    if (error) setPwMsg({ ok: false, text: passwordErrorMessage(error, t, t('تعذر تغيير كلمة المرور. حاول مجدداً أو استخدم رابط استعادة كلمة المرور.', 'Could not change your password. Try again or use a password recovery link.')) });
    else {
      setPw(""); setPw2("");
      setPwMsg({ ok: true, text: t("تم تغيير كلمة المرور.", "Password changed.") });
    }
  };

  return (
    <section className="mx-auto max-w-xl space-y-10 px-5 pb-24 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">{t("حسابي", "My account")}</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="min-h-11"><Link to="/orders">{t("طلباتي", "My orders")}</Link></Button>
          <Button variant="outline" className="min-h-11" onClick={() => supabase.auth.signOut()}>{t("تسجيل الخروج", "Sign out")}</Button>
        </div>
      </div>

      <form onSubmit={saveInfo} className="space-y-4 border border-border p-5 sm:p-6">
        <h2 className="font-display text-xl">{t("البيانات الشخصية", "Personal details")}</h2>
        {profile.error && <p role="alert" className="text-destructive">{t("تعذر تحميل بياناتك.", "Unable to load your details.")}</p>}
        <div className="space-y-2">
          <Label htmlFor="acc-name">{t("الاسم", "Name")}</Label>
          <Input id="acc-name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} disabled={!profile.isSuccess} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acc-address">{t("مكان السكن / العنوان", "Residence / address")}</Label>
          <Input id="acc-address" value={address} maxLength={300} onChange={(e) => setAddress(e.target.value)} disabled={!profile.isSuccess} />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("البريد الإلكتروني", "Email")}: <bdi>{user.email || "—"}</bdi>
          {profile.data?.phone && <> · {t("الهاتف", "Phone")}: <bdi dir="ltr">{profile.data.phone}</bdi></>}
        </p>
        {infoMsg && <p role="status" className={infoMsg.ok ? "text-primary" : "text-destructive"}>{infoMsg.text}</p>}
        <Button type="submit" className="min-h-11 w-full sm:w-auto" disabled={savingInfo || !profile.isSuccess}>
          {savingInfo ? t("جارٍ الحفظ...", "Saving...") : t("حفظ البيانات", "Save details")}
        </Button>
      </form>

      <form onSubmit={savePw} className="space-y-4 border border-border p-5 sm:p-6">
        <h2 className="font-display text-xl">{t("تغيير كلمة المرور", "Change password")}</h2>
        <div className="space-y-2">
          <Label htmlFor="acc-pw">{t("كلمة المرور الجديدة", "New password")}</Label>
          <SecretInput id="acc-pw" value={pw} autoComplete="new-password" onChange={(e) => setPw(e.target.value)} aria-describedby="acc-pw-rules" />
          <PasswordChecklist id="acc-pw-rules" password={pw} policy={pp.policy} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acc-pw2">{t("تأكيد كلمة المرور", "Confirm password")}</Label>
          <SecretInput id="acc-pw2" value={pw2} autoComplete="new-password" onChange={(e) => setPw2(e.target.value)} />
        </div>
        {pwMsg && <p role="status" className={pwMsg.ok ? "text-primary" : "text-destructive"}>{pwMsg.text}</p>}
        <Button type="submit" className="min-h-11 w-full sm:w-auto" disabled={savingPw}>
          {savingPw ? t("جارٍ الحفظ...", "Saving...") : t("تغيير كلمة المرور", "Change password")}
        </Button>
      </form>
    </section>
  );
}
