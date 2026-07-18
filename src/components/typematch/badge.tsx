import type { ReactNode } from "react";
import { getBadgeVariant, type BadgeSize, type BadgeVariant } from "./badge-utils";

/**
 * Centralised badge variants.
 * - Text is the source of truth (the colour only reinforces it).
 * - Variants come from semantic tokens declared in `src/styles.css`
 *   so they adapt to light/dark mode automatically.
 */
const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "border-border bg-secondary text-foreground",
  outline: "border-border bg-transparent text-muted-foreground",
  accent: "border-accent bg-accent text-accent-foreground",
  muted: "border-border bg-muted text-muted-foreground",
  // Semantic tones — backed by CSS variables in styles.css
  safe: "border-[var(--badge-safe-border)] bg-[var(--badge-safe-bg)] text-[var(--badge-safe-fg)]",
  warning:
    "border-[var(--badge-warning-border)] bg-[var(--badge-warning-bg)] text-[var(--badge-warning-fg)]",
  danger:
    "border-[var(--badge-danger-border)] bg-[var(--badge-danger-bg)] text-[var(--badge-danger-fg)]",
  trial:
    "border-[var(--badge-trial-border)] bg-[var(--badge-trial-bg)] text-[var(--badge-trial-fg)]",
  subscription:
    "border-[var(--badge-sub-border)] bg-[var(--badge-sub-bg)] text-[var(--badge-sub-fg)]",
  screen:
    "border-[var(--badge-screen-border)] bg-[var(--badge-screen-bg)] text-[var(--badge-screen-fg)]",
  print:
    "border-[var(--badge-print-border)] bg-[var(--badge-print-bg)] text-[var(--badge-print-fg)]",
  display:
    "border-[var(--badge-display-border)] bg-[var(--badge-display-bg)] text-[var(--badge-display-fg)]",
  experimental:
    "border-[var(--badge-exp-border)] bg-[var(--badge-exp-bg)] text-[var(--badge-exp-fg)]",
  neutral: "border-border bg-muted text-muted-foreground",
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-[11px]",
};

export function Badge({
  children,
  label,
  variant,
  size = "sm",
  className = "",
}: {
  children?: ReactNode;
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}) {
  const text = label ?? (typeof children === "string" ? children : "");
  const resolved: BadgeVariant = variant ?? (text ? getBadgeVariant(text) : "default");
  return (
    <span
      className={
        "inline-flex items-center rounded-md border uppercase tracking-[0.12em] font-medium font-ui whitespace-nowrap " +
        SIZE_STYLES[size] +
        " " +
        VARIANT_STYLES[resolved] +
        " " +
        className
      }
    >
      {children ?? label}
    </span>
  );
}
