import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useLanguage } from "@/lib/language";

type Mode = "system" | "light" | "dark";
const KEY = "alqurem-theme";

export function applyTheme(mode: Mode) {
  const dark =
    mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export function ThemeToggle({ className = "", showLabel = false }: { className?: string; showLabel?: boolean }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as Mode | null;
    if (saved === "light" || saved === "dark" || saved === "system") setMode(saved);
  }, []);

  useEffect(() => {
    applyTheme(mode);
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => applyTheme("system");
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [mode]);

  const next: Record<Mode, Mode> = { system: "light", light: "dark", dark: "system" };
  const label =
    mode === "system" ? t("حسب الجهاز", "Device default") : mode === "light" ? t("فاتح", "Light") : t("داكن", "Dark");
  const Icon = mode === "system" ? Monitor : mode === "light" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => {
        const m = next[mode];
        setMode(m);
        localStorage.setItem(KEY, m);
      }}
      aria-label={`${t("المظهر", "Theme")}: ${label}`}
      title={label}
      className={className}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {showLabel && <span>{t("المظهر", "Theme")}: {label}</span>}
    </button>
  );
}

export const themeInitScript = `(function(){try{var m=localStorage.getItem("${KEY}")||"system";var d=m==="dark"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
