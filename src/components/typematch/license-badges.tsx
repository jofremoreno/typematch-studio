import type { FontRecord } from "@/data/fonts";
import { isPremiumReference } from "@/data/fonts";

/**
 * Compact pill used across the UI to describe a font's availability and
 * licensing status. Pure presentational — no logic beyond label mapping.
 */
export function LicenseBadges({ font, compact = false }: { font: FontRecord; compact?: boolean }) {
  const items: { label: string; tone: "neutral" | "ok" | "warn" | "danger" }[] = [];

  switch (font.availability) {
    case "open-source":
      items.push({ label: "Open source", tone: "ok" });
      items.push({ label: "Commercial use", tone: "ok" });
      break;
    case "free":
      items.push({ label: "Free", tone: "ok" });
      items.push({ label: "Commercial use", tone: "ok" });
      break;
    case "trial":
      items.push({ label: "Trial only", tone: "warn" });
      items.push({ label: "License required", tone: "warn" });
      break;
    case "paid":
      items.push({ label: "Paid", tone: "danger" });
      items.push({ label: "License required", tone: "danger" });
      break;
    case "subscription":
      items.push({ label: "Subscription", tone: "warn" });
      items.push({ label: "License required", tone: "warn" });
      break;
    case "inspiration-only":
      items.push({ label: "Inspiration", tone: "neutral" });
      break;
    default:
      items.push({ label: "Free", tone: "ok" });
  }

  if (font.needsManualLicenseCheck) {
    items.push({ label: "Verify license", tone: "warn" });
  }

  if (font.catalogRole === "premium-reference") {
    items.push({ label: "Premium reference", tone: "neutral" });
  }

  if (font.canPreviewInApp === false) {
    items.push({ label: "Fallback preview", tone: "neutral" });
  }

  const tones = {
    ok: "border-border bg-secondary text-foreground",
    neutral: "border-border bg-transparent text-muted-foreground",
    warn: "border-border bg-muted text-foreground",
    danger: "border-accent bg-accent text-accent-foreground",
  } as const;

  const list = compact ? items.slice(0, 3) : items;

  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((it) => (
        <span
          key={it.label}
          className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${tones[it.tone]}`}
        >
          {it.label}
        </span>
      ))}
    </div>
  );
}

/** Single-word availability label for compact contexts. */
export function availabilityLabel(font: FontRecord): string {
  switch (font.availability) {
    case "open-source": return "Open source";
    case "free": return "Free";
    case "trial": return "Trial";
    case "paid": return "Paid";
    case "subscription": return "Subscription";
    case "inspiration-only": return "Inspiration";
    default: return "Free";
  }
}

/** Returns the source-button label appropriate for this font's availability. */
export function sourceButtonLabel(font: FontRecord): string {
  switch (font.availability) {
    case "trial": return "View trial source";
    case "paid": return "View official source";
    case "subscription": return "View subscription source";
    case "inspiration-only": return "View reference";
    default: return "View source";
  }
}

/** Standard licensing notice copy per availability. */
export function licensingNotice(font: FontRecord): string | null {
  if (!isPremiumReference(font)) return null;
  switch (font.availability) {
    case "trial":
      return "Trial fonts are for testing or mockups. Verify the license before using commercially.";
    case "paid":
      return "This is a premium reference. A commercial license is required.";
    case "subscription":
      return "Available through a subscription service. Usage depends on the provider's license.";
    case "inspiration-only":
      return "Listed for inspiration only. Verify the license before any usage.";
    default:
      return null;
  }
}