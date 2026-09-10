import type { ReactNode } from "react";
import { useReveal } from "@/lib/language";

export function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    // @ts-expect-error polymorphic tag
    <Tag ref={ref} data-visible={visible} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-5 text-muted-foreground">{description}</p>}
    </Reveal>
  );
}
