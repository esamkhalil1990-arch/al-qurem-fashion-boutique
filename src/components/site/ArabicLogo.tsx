import { useId } from "react";

type ArabicLogoProps = {
  className?: string;
  animated?: boolean;
  title?: string;
};

export function ArabicLogo({ className = "", animated = false, title = "القرم" }: ArabicLogoProps) {
  const titleId = useId();
  const maskId = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 520 300"
      role="img"
      aria-labelledby={titleId}
      className={`${animated ? "logo-is-writing" : ""} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="520" height="300">
          <rect width="520" height="300" fill="black" />
          <text
            x="260"
            y="205"
            textAnchor="middle"
            direction="rtl"
            unicodeBidi="bidi-override"
            className="logo-mask-stroke"
            fill="none"
            stroke="white"
            strokeWidth="17"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            القرم
          </text>
          <path
            d="M84 229C151 265 317 272 434 229C465 217 484 198 477 181"
            className="logo-mask-flourish"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <text
          x="260"
          y="205"
          textAnchor="middle"
          direction="rtl"
          unicodeBidi="bidi-override"
          className="logo-lettering"
        >
          القرم
        </text>
        <path
          d="M84 229C151 265 317 272 434 229C465 217 484 198 477 181"
          className="logo-flourish"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>

      <g className="logo-diacritics" fill="currentColor">
        <circle cx="333" cy="86" r="6" />
        <circle cx="350" cy="80" r="6" />
        <path d="M189 73c15-10 31-12 46-5-12 3-22 10-29 22-7-8-12-13-17-17Z" />
      </g>
    </svg>
  );
}