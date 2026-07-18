import type { FontRecord } from "@/data/fonts";
import { isPremiumReference } from "@/data/fonts";

export function availabilityLabel(font: FontRecord): string {
  switch (font.availability) {
    case "open-source":
      return "Open source";
    case "free":
      return "Free";
    case "trial":
      return "Trial";
    case "paid":
      return "Paid";
    case "subscription":
      return "Subscription";
    case "inspiration-only":
      return "Inspiration";
    case "pay-what-you-want":
      return "Pay what you want";
    default:
      return "Free";
  }
}

export function sourceButtonLabel(font: FontRecord): string {
  switch (font.availability) {
    case "trial":
      return "View trial source";
    case "paid":
    case "pay-what-you-want":
      return "View official source";
    case "subscription":
      return "View subscription source";
    case "inspiration-only":
      return "View reference";
    default:
      return "View source";
  }
}

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
