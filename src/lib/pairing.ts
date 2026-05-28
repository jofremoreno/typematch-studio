import { FONTS, FONTS_BY_ID, type FontRecord } from "@/data/fonts";

export type PairingCategory =
  | "Reliable System Pairing"
  | "Editorial Contrast Pairing"
  | "Experimental / High Character Pairing";

export interface Pairing {
  name: string;
  category: PairingCategory;
  primary: FontRecord;
  secondary: FontRecord;
  primaryRole: string;
  secondaryRole: string;
  contrastType: string;
  formalRelationship: string;
  personalityRelationship: string;
  bestUseCases: string[];
  avoidUseCases: string[];
  riskLevel: "Low" | "Medium" | "High";
  confidence: number;
  explanation: string;
}

/* -----------------------------------------------------------
 * Heuristics — every score is derived from font attributes,
 * never random. Same input always returns the same pairings.
 * --------------------------------------------------------- */

const sameCategoryPenalty = (a: FontRecord, b: FontRecord) =>
  a.classification === b.classification ? 25 : 0;

const widthClash = (a: FontRecord, b: FontRecord) =>
  a.width !== b.width && (a.width === "Condensed" || b.width === "Condensed") ? 8 : 0;

function contrastScore(a: FontRecord, b: FontRecord) {
  // formal contrast in classification + structure
  let s = 0;
  if (a.classification !== b.classification) s += 30;
  const contrastMap = { Low: 0, Medium: 1, High: 2, "Very high": 3 } as const;
  s += Math.abs(contrastMap[a.strokeContrast] - contrastMap[b.strokeContrast]) * 8;
  const xhMap = { Low: 0, Medium: 1, High: 2, "Very high": 3 } as const;
  s += Math.abs(xhMap[a.xHeight] - xhMap[b.xHeight]) * 4;
  return s;
}

function compatibilityScore(a: FontRecord, b: FontRecord) {
  let s = 100;
  s -= sameCategoryPenalty(a, b);
  s -= widthClash(a, b);
  // both readable in their best roles
  s += (a.versatilityScore + b.versatilityScore) / 20;
  return s;
}

function reliableScore(primary: FontRecord, secondary: FontRecord) {
  // safe pair: differing categories, both readable, low risk
  let s = compatibilityScore(primary, secondary);
  s += secondary.readabilityScore / 4;
  s += secondary.bodyTextScore / 5;
  if (secondary.pairingDifficulty === "Easy") s += 8;
  if (secondary.pairingDifficulty === "Hard") s -= 12;
  if (secondary.classification === "Display") s -= 30; // displays aren't reliable seconds
  return s;
}

function editorialScore(primary: FontRecord, secondary: FontRecord) {
  let s = compatibilityScore(primary, secondary) * 0.6;
  s += contrastScore(primary, secondary) * 0.8;
  s += secondary.displayScore / 6;
  s += secondary.readabilityScore / 8;
  if (secondary.classification === "Display" && secondary.displayScore > 88) s += 10;
  // editorial wants distinct categories
  if (primary.classification === secondary.classification) s -= 18;
  return s;
}

function experimentalScore(primary: FontRecord, secondary: FontRecord) {
  let s = contrastScore(primary, secondary) * 1.2;
  s += secondary.displayScore / 5;
  // reward strong personality / quirky character
  if (secondary.personality.some((p) => /expressive|characterful|quirky|retro|playful|warm/i.test(p))) s += 10;
  if (secondary.classification === "Display" || secondary.classification === "Mono") s += 8;
  // mild penalty for boring neutrality
  if (secondary.personality.includes("neutral")) s -= 12;
  return s;
}

function pickRole(primary: FontRecord, secondary: FontRecord): [string, string] {
  // primary is usually display/headline; secondary supports body / UI / accents
  const primaryRole =
    primary.displayScore >= primary.bodyTextScore ? "Headlines & display" : "Body & primary text";
  let secondaryRole: string;
  if (secondary.classification === "Mono") secondaryRole = "Labels, captions, technical accents";
  else if (secondary.bodyTextScore >= 85) secondaryRole = "Body text & long-form";
  else if (secondary.uiScore >= 85) secondaryRole = "UI labels & interface text";
  else if (secondary.displayScore >= 85) secondaryRole = "Secondary headlines & subheads";
  else secondaryRole = "Supporting copy & metadata";
  return [primaryRole, secondaryRole];
}

function relationship(a: FontRecord, b: FontRecord) {
  if (a.classification !== b.classification) {
    return `${a.classification.toLowerCase()} primary against ${b.classification.toLowerCase()} secondary creates category contrast.`;
  }
  return `same-category pairing — contrast must be created through weight, scale and spacing rather than form.`;
}

function personalityRelation(a: FontRecord, b: FontRecord) {
  const shared = a.personality.filter((p) => b.personality.includes(p));
  if (shared.length) {
    return `Both share a ${shared.slice(0, 2).join(" / ")} character, keeping the voice coherent while differing in form.`;
  }
  return `Personalities deliberately diverge — ${a.personality.slice(0, 2).join(" / ")} against ${b.personality.slice(0, 2).join(" / ")} — which adds tension that should be managed through scale and spacing.`;
}

function explain(category: PairingCategory, p: FontRecord, s: FontRecord) {
  const aCat = p.classification.toLowerCase();
  const bCat = s.classification.toLowerCase();
  switch (category) {
    case "Reliable System Pairing":
      return `This pairing works because ${s.name} provides ${
        s.classification === "Sans-serif" ? "structural neutrality and high legibility" : "a readable counterpoint"
      } against ${p.name}'s ${p.personality.slice(0, 2).join(", ")} voice. The ${aCat}/${bCat} relationship creates clear role separation without breaking system coherence, which is what brand systems, dashboards and corporate documents need.`;
    case "Editorial Contrast Pairing":
      return `${p.name} carries the editorial voice with ${p.strokeContrast.toLowerCase()} stroke contrast and ${p.personality[0]} character, while ${s.name} introduces ${
        s.classification === "Sans-serif" ? "a quieter structural rhythm" : "a contrasting reading texture"
      }. The contrast is visible but controlled, making it useful for cultural brands, portfolios and long-form editorial layouts.`;
    case "Experimental / High Character Pairing":
      return `This is a more expressive combination. ${s.name} brings strong personality (${s.personality.slice(0, 2).join(", ")}), which amplifies ${p.name}'s voice but increases risk: scale, spacing and role separation must be controlled, and it is not suitable for dense UI or long-form body text. Use it for campaigns, covers and identity work where the typography is part of the message.`;
  }
}

function rank(primary: FontRecord, score: (p: FontRecord, s: FontRecord) => number) {
  return FONTS.filter((f) => f.id !== primary.id)
    .map((f) => ({ f, score: score(primary, f) }))
    .sort((a, b) => b.score - a.score);
}

function buildPairing(
  primary: FontRecord,
  secondary: FontRecord,
  category: PairingCategory,
  rawScore: number,
): Pairing {
  const [primaryRole, secondaryRole] = pickRole(primary, secondary);
  const sameCat = primary.classification === secondary.classification;

  let riskLevel: Pairing["riskLevel"];
  if (category === "Reliable System Pairing") riskLevel = sameCat ? "Medium" : "Low";
  else if (category === "Editorial Contrast Pairing") riskLevel = "Medium";
  else riskLevel = "High";

  // normalize confidence to 0-100
  const confidence = Math.max(40, Math.min(98, Math.round(rawScore)));

  const contrastType = sameCat
    ? "Structural contrast within the same category"
    : `Category contrast — ${primary.classification.toLowerCase()} vs ${secondary.classification.toLowerCase()}`;

  return {
    name: `${primary.name} + ${secondary.name}`,
    category,
    primary,
    secondary,
    primaryRole,
    secondaryRole,
    contrastType,
    formalRelationship: relationship(primary, secondary),
    personalityRelationship: personalityRelation(primary, secondary),
    bestUseCases:
      category === "Reliable System Pairing"
        ? primary.recommendedContexts.slice(0, 2).concat(secondary.recommendedContexts.slice(0, 1))
        : category === "Editorial Contrast Pairing"
          ? ["Editorial websites", "Cultural identities", "Portfolios", "Magazines"]
          : ["Campaigns", "Covers", "Identity systems", "Events"],
    avoidUseCases:
      category === "Experimental / High Character Pairing"
        ? ["Dense UI", "Long-form body text", "Operational dashboards"]
        : secondary.avoidContexts.slice(0, 2),
    riskLevel,
    confidence,
    explanation: explain(category, primary, secondary)!,
  };
}

export function buildRecommendations(primary: FontRecord): Pairing[] {
  const reliable = rank(primary, reliableScore);
  const editorial = rank(primary, editorialScore);
  const experimental = rank(primary, experimentalScore);

  // pick top candidates, but avoid duplicates across the three slots
  const picked = new Set<string>();
  const pickFrom = (list: typeof reliable) => {
    for (const item of list) {
      if (!picked.has(item.f.id)) {
        picked.add(item.f.id);
        return item;
      }
    }
    return list[0];
  };

  const r = pickFrom(reliable);
  const e = pickFrom(editorial);
  const x = pickFrom(experimental);

  return [
    buildPairing(primary, r.f, "Reliable System Pairing", r.score),
    buildPairing(primary, e.f, "Editorial Contrast Pairing", e.score),
    buildPairing(primary, x.f, "Experimental / High Character Pairing", x.score),
  ];
}

/* ------------------------------------------------------------------
 * Contrast-behaviour analysis — describes how the analyzed font
 * behaves when paired at three contrast levels.
 * ------------------------------------------------------------------ */

export interface ContrastBehaviour {
  level: "Low contrast" | "Medium contrast" | "High contrast";
  whenWorks: string;
  whenFails: string;
  risk: "Low" | "Medium" | "High";
  recommendation: string;
}

export function analyzeContrastBehaviour(font: FontRecord): ContrastBehaviour[] {
  const tolerance = font.contrastTolerance;
  return [
    {
      level: "Low contrast",
      whenWorks:
        "Useful for quiet, systematic identities where hierarchy is created through size, weight and spacing.",
      whenFails:
        "Can feel flat if scale and spacing don't carry the hierarchy, especially in editorial work.",
      risk: tolerance === "Low" ? "Low" : "Medium",
      recommendation:
        tolerance === "Low"
          ? `${font.name} performs well in low-contrast systems thanks to its measured optical voice.`
          : `${font.name} can sit in low-contrast pairings but you will need strong scale jumps to keep hierarchy legible.`,
    },
    {
      level: "Medium contrast",
      whenWorks:
        "Usually the safest professional range — creates enough hierarchy without breaking system coherence.",
      whenFails: "Rarely fails outright; the risk is being visually unremarkable.",
      risk: "Low",
      recommendation: `Default range for ${font.name}. Use a counterpart from a different classification and let weight + scale carry the hierarchy.`,
    },
    {
      level: "High contrast",
      whenWorks:
        "Useful for editorial or campaign work where the typography is part of the message.",
      whenFails:
        "Fails when both fonts shout. Needs careful scale, spacing and a strict role assignment.",
      risk: tolerance === "High" ? "Medium" : "High",
      recommendation:
        font.displayScore > 85
          ? `${font.name} can lead high-contrast pairings as the display voice; pick a quieter, highly legible counterpart for body.`
          : `${font.name} is better as the quieter half of a high-contrast pair — let a stronger display font lead and use ${font.name} for support and reading.`,
    },
  ];
}

/* ------------------------------------------------------------------
 * Print vs Screen reasoning
 * ------------------------------------------------------------------ */

export function printScreenReasoning(font: FontRecord) {
  if (font.bestMedium === "Screen") {
    return `Better for screens because the ${font.xHeight.toLowerCase()} x-height and ${font.aperture.toLowerCase()} apertures improve legibility at small sizes and on backlit displays.`;
  }
  if (font.bestMedium === "Print") {
    return `Better for print because the ${font.strokeContrast.toLowerCase()} stroke contrast and ${font.rhythm.toLowerCase()} rhythm create a more refined editorial texture on paper.`;
  }
  return `Works in both contexts, but the role assignment should change depending on the medium — give it more display weight in print and prioritize legibility settings on screen.`;
}

// utility to look up a font by id safely
export function getFontById(id: string): FontRecord | undefined {
  return FONTS_BY_ID[id];
}