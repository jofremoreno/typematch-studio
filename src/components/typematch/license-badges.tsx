import type { FontRecord } from "@/data/fonts";
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
  if (font.sourceName === "Adobe Fonts" && !labels.includes("Adobe Fonts"))
    labels.unshift("Adobe Fonts");
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
