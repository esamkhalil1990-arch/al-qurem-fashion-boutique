import { useEffect, useState } from 'react';
import { Check, Circle } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { checkPassword, loadPasswordPolicy, policyFromError, savePasswordPolicy, DEFAULT_PASSWORD_POLICY, type PasswordPolicy } from '@/lib/auth-input';

export function usePasswordPolicy() {
  const [policy, setPolicy] = useState<PasswordPolicy>(DEFAULT_PASSWORD_POLICY);
  useEffect(() => setPolicy(loadPasswordPolicy()), []);
  const learn = (error: unknown) => setPolicy(p => { const n = policyFromError(error, p); savePasswordPolicy(n); return n; });
  return { policy, learn, met: (pw: string) => Object.values(checkPassword(pw, policy)).every(Boolean) };
}

export function PasswordChecklist({ password, policy, id }: { password: string; policy: PasswordPolicy; id?: string }) {
  const { t } = useLanguage();
  const r = checkPassword(password, policy);
  const labels = {
    length: t(`${policy.minLength} أحرف على الأقل`, `At least ${policy.minLength} characters`),
    lower: t('حرف إنجليزي صغير (a-z)', 'A lowercase letter (a-z)'),
    upper: t('حرف إنجليزي كبير (A-Z)', 'An uppercase letter (A-Z)'),
    digit: t('رقم (0-9)', 'A number (0-9)'),
    symbol: t('رمز خاص مثل ! @ #', 'A symbol such as ! @ #'),
  };
  return <div id={id} className="space-y-1.5 text-sm">
    <ul aria-live="polite" className="space-y-1">
      {(Object.keys(r) as (keyof typeof r)[]).map(k => <li key={k} className={`flex items-center gap-2 transition-colors ${r[k] ? 'text-primary' : 'text-muted-foreground'}`}>
        {r[k] ? <Check className="size-4 shrink-0" aria-hidden="true" /> : <Circle className="size-3.5 shrink-0" aria-hidden="true" />}
        <span>{labels[k]}</span><span className="sr-only">{r[k] ? t('(مستوفى)', '(met)') : t('(غير مستوفى)', '(not met)')}</span>
      </li>)}
    </ul>
    <p className="text-xs text-muted-foreground">{t('نتحقق أيضاً عند الحفظ من أن كلمة المرور لم تظهر في تسريبات معروفة.', 'When you save, we also check the password has not appeared in known data breaches.')}</p>
  </div>;
}
