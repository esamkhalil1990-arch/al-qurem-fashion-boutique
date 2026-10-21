import { useId } from "react";
import officialLogo from "@/assets/alqurem-official-mark.png.asset.json";

type ArabicLogoProps = {
  className?: string;
  animated?: boolean;
  title?: string;
};

/**
 * Authentic Arabic mark cropped from the verified store's official profile photo.
 * The reveal mask animates the original pixels, never a recreated wordmark.
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
          <rect className="logo-wipe" x="163" y="0" width="194" height="260" fill="white" />
        </mask>
      </defs>

      <image
        href={officialLogo.url}
        x="163"
        y="2"
        width="194"
        height="256"
        preserveAspectRatio="xMidYMid meet"
        mask={animated ? `url(#${maskId})` : undefined}
      />
    </svg>
  );
}
