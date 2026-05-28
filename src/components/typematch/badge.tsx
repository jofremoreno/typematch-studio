import type { ReactNode } from "react";

type Variant = "default" | "outline" | "accent" | "muted";

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  const styles: Record<Variant, string> = {
    default: "border-border bg-secondary text-foreground",
    outline: "border-border bg-transparent text-muted-foreground",
    accent: "border-accent bg-accent text-accent-foreground",
    muted: "border-border bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${styles[variant]}`}
    >
      {children}
    </span>
  );
}