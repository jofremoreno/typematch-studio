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

export function getBadgeVariant(label: string): BadgeVariant {
  const key = label.trim().toLowerCase();
  if (
    [
      "free",
      "open source",
      "open-source",
      "commercial use",
      "safe license",
      "can preview",
    ].includes(key)
  )
    return "safe";
  if (
    [
      "needs license check",
      "verify license",
      "directory source",
      "fallback preview",
      "verify",
    ].includes(key)
  )
    return "warning";
  if (["paid", "license required", "premium reference", "premium"].includes(key)) return "danger";
  if (["trial only", "trial", "test font", "mockup only"].includes(key)) return "trial";
  if (["subscription", "adobe fonts", "service license"].includes(key)) return "subscription";
  if (["ui ready", "screen friendly", "screen"].includes(key)) return "screen";
  if (["print friendly", "editorial", "print"].includes(key)) return "print";
  if (["display only", "poster", "display"].includes(key)) return "display";
  if (key === "experimental") return "experimental";
  return "neutral";
}
