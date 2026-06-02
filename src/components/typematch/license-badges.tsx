import type { FontRecord } from "@/data/fonts";
import { isPremiumReference } from "@/data/fonts";
import { Badge } from "./badge";

/**
 * Compact pill used across the UI to describe a font's availability and
 * licensing status. Pure presentational — no logic beyond label mapping.
 */
export function LicenseBadges({ font, compact = false }: { font: FontRecord; compact?: boolean }) {
  const labels: string[] = [];
  switch (font.availability) {
    case "open-source":
      labels.push("Open source", "Commercial use");
      break;
    case "free":
      labels.push("Free", "Commercial use");
      break;
    case "trial":
      labels.push("Trial only", "License required");
      break;
    case "paid":
      labels.push("Paid", "License required");
      break;
    case "subscription":
      labels.push("Subscription", "License required");
      break;
    case "inspiration-only":
      labels.push("Inspiration");
      break;
    case "pay-what-you-want":
      labels.push("Pay what you want", "Free weights available");
      break;
    default:
      labels.push("Free");
  }
  if (font.needsManualLicenseCheck) labels.push("Verify license");
  if (font.catalogRole === "premium-reference") labels.push("Premium reference");
  if (font.sourceName === "Atipo Foundry") labels.unshift("Atipo Foundry");
  if (font.sourceName === "Adobe Fonts" && !labels.includes("Adobe Fonts")) labels.unshift("Adobe Fonts");
  if (font.canPreviewInApp === false) labels.push("Fallback preview");

  const list = compact ? labels.slice(0, 3) : labels;
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((l) => (
        <Badge key={l} label={l} />
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
    case "pay-what-you-want": return "Pay what you want";
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
    case "pay-what-you-want": return "View official source";
    default: return "View source";
  }
}

/** Standard licensing notice copy per availability. */
export function licensingNotice(font: FontRecord): string | null {
  if (font.availability === "pay-what-you-want") {
    return "Pay-what-you-want family. Free weights may be available, but usage depends on the official license — verify before any commercial use.";
  }
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