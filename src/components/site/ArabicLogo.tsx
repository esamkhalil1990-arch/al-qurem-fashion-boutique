import { useId } from "react";

type ArabicLogoProps = {
  className?: string;
  animated?: boolean;
  title?: string;
};

/**
 * Original Arabic wordmark for "القرم".
 * Calligraphic (Diwani-inspired) feel, revealed with a right-to-left
 * "writing" wipe plus an underlying flourish that draws itself.
 */
export function ArabicLogo({ className = "", animated = false, title = "القرم" }: ArabicLogoProps) {
  const titleId = useId();
  const uid = useId().replace(/:/g, "");
  const maskId = `logo-mask-${uid}`;

  return (
    <svg
      viewBox="0 0 520 260"
      role="img"
      aria-labelledby={titleId}
      className={`${animated ? "logo-is-writing" : ""} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="520" height="260">
          <rect className="logo-wipe" x="0" y="0" width="520" height="260" fill="white" />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <text
          x="260"
          y="180"
          textAnchor="middle"
          direction="rtl"
          className="logo-lettering"
          fill="currentColor"
        >
          القرم
        </text>
      </g>

      <path
        d="M92 214C158 244 330 248 432 212C462 201 478 186 472 170"
        className="logo-flourish"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
