import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';

export const signInFieldClass = 'h-12 w-full min-w-0 rounded-md border border-input bg-background px-4 text-base outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 disabled:opacity-60';

export function SecretInput({ className = '', ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const label = visible ? t('إخفاء الرمز أو كلمة المرور', 'Hide passcode or password') : t('إظهار الرمز أو كلمة المرور', 'Show passcode or password');
  return <div className="relative min-w-0" dir="ltr">
    <input {...props} type={visible ? 'text' : 'password'} className={`${signInFieldClass} pe-14 ${className}`} />
    <Button type="button" variant="ghost" size="icon" disabled={props.disabled} aria-label={label} aria-pressed={visible} title={label} onClick={() => setVisible(value => !value)} className="absolute end-1 top-1 h-10 w-11 text-muted-foreground">
      {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
    </Button>
  </div>;
}