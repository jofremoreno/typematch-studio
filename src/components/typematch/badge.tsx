import type { ReactNode } from "react";

/**
 * Centralised badge variants.
 * - Text is the source of truth (the colour only reinforces it).
 * - Variants come from semantic tokens declared in `src/styles.css`
 *   so they adapt to light/dark mode automatically.
 */
export type BadgeVariant =
  | "default"
  | "outline"
  | "accent"
  | "muted"
  | "safe"
  | "warning"
  | "danger"
  | "trial"
  | "subscription"
  | "screen"
  | "print"
  | "display"
  | "experimental"
  | "neutral";

export type BadgeSize = "sm" | "md";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "border-border bg-secondary text-foreground",
  outline: "border-border bg-transparent text-muted-foreground",
  accent: "border-accent bg-accent text-accent-foreground",
  muted: "border-border bg-muted text-muted-foreground",
  // Semantic tones — backed by CSS variables in styles.css
  safe: "border-[var(--badge-safe-border)] bg-[var(--badge-safe-bg)] text-[var(--badge-safe-fg)]",
  warning: "border-[var(--badge-warning-border)] bg-[var(--badge-warning-bg)] text-[var(--badge-warning-fg)]",
  danger: "border-[var(--badge-danger-border)] bg-[var(--badge-danger-bg)] text-[var(--badge-danger-fg)]",
  trial: "border-[var(--badge-trial-border)] bg-[var(--badge-trial-bg)] text-[var(--badge-trial-fg)]",
  subscription: "border-[var(--badge-sub-border)] bg-[var(--badge-sub-bg)] text-[var(--badge-sub-fg)]",
  screen: "border-[var(--badge-screen-border)] bg-[var(--badge-screen-bg)] text-[var(--badge-screen-fg)]",
  print: "border-[var(--badge-print-border)] bg-[var(--badge-print-bg)] text-[var(--badge-print-fg)]",
  display: "border-[var(--badge-display-border)] bg-[var(--badge-display-bg)] text-[var(--badge-display-fg)]",
  experimental: "border-[var(--badge-exp-border)] bg-[var(--badge-exp-bg)] text-[var(--badge-exp-fg)]",
  neutral: "border-border bg-muted text-muted-foreground",
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-[11px]",
};

/**
 * Map a label to a sensible default variant. Centralised so all surfaces
 * (font cards, detail, pairing, compare, licensing) stay visually consistent.
 */
export function getBadgeVariant(label: string): BadgeVariant {
  const k = label.trim().toLowerCase();
  // safe / available
  if (["free", "open source", "open-source", "commercial use", "safe license", "can preview"].includes(k))
    return "safe";
  // warning / verify
  if (["needs license check", "verify license", "directory source", "fallback preview", "verify"].includes(k))
    return "warning";
  // danger / paid
  if (["paid", "license required", "premium reference", "premium"].includes(k))
    return "danger";
  // trial
  if (["trial only", "trial", "test font", "mockup only"].includes(k))
    return "trial";
  // subscription
  if (["subscription", "adobe fonts", "service license"].includes(k))
    return "subscription";
  // screen
  if (["ui ready", "screen friendly", "screen"].includes(k))
    return "screen";
  // print
  if (["print friendly", "editorial", "print"].includes(k))
    return "print";
  // display
  if (["display only", "poster", "display"].includes(k))
    return "display";
  // experimental
  if (["experimental"].includes(k))
    return "experimental";
  // neutral fallback for: Branding, Mono, Informational only, Inspiration, etc.
  return "neutral";
}

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
        "inline-flex items-center rounded-sm border uppercase tracking-[0.14em] font-medium font-ui " +
        SIZE_STYLES[size] + " " + VARIANT_STYLES[resolved] + " " + className
      }
    >
      {children ?? label}
    </span>
  );
}