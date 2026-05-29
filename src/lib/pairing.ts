import { FONTS, FONTS_BY_ID, isPremiumReference, type FontRecord } from "@/data/fonts";

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
  /** Free alternative for the secondary, when the secondary is a premium ref. */
  freeAlternative?: FontRecord | null;
  /** True if either side requires a commercial license. */
  licenseRequired: boolean;
}

/* -----------------------------------------------------------
 * Heuristics — every score is derived from font attributes,
 * never random. Same input always returns the same pairings.
 * --------------------------------------------------------- */

const sameCategoryPenalty = (a: FontRecord, b: FontRecord) =>
  a.classification === b.classification ? 25 : 0;

const widthClash = (a: FontRecord, b: FontRecord) =>
  a.width !== b.width && (a.width === "Condensed" || b.width === "Condensed") ? 8 : 0;

const xhMap = { Low: 0, Medium: 1, High: 2, "Very high": 3 } as const;
const contrastMap = { Low: 0, Medium: 1, High: 2, "Very high": 3 } as const;

/** Two fonts are "too similar" when classification + subclassification +
 * x-height + stroke contrast all line up — no hierarchy can emerge. */
function similarityIndex(a: FontRecord, b: FontRecord): number {
  let s = 0;
  if (a.classification === b.classification) s += 3;
  if (a.subclassification === b.subclassification) s += 3;
  if (a.xHeight === b.xHeight) s += 1;
  if (a.strokeContrast === b.strokeContrast) s += 1;
  if (a.width === b.width) s += 1;
  const sharedPersonality = a.personality.filter((p) => b.personality.includes(p)).length;
  s += Math.min(2, sharedPersonality);
  return s; // 0..11
}

/** Both fonts shouting in the same register = visual competition. */
function competesForAttention(a: FontRecord, b: FontRecord): boolean {
  return a.displayScore > 85 && b.displayScore > 85 && a.bodyTextScore < 70 && b.bodyTextScore < 70;
}

/** Generic guard: never propose a font as body/UI if it cannot perform there. */
function unfitForSupport(secondary: FontRecord): boolean {
  return (
    secondary.classification === "Display" ||
    secondary.bodyTextScore < 60 ||
    secondary.readabilityScore < 70
  );
}

function contrastScore(a: FontRecord, b: FontRecord) {
  let s = 0;
  if (a.classification !== b.classification) s += 30;
  s += Math.abs(contrastMap[a.strokeContrast] - contrastMap[b.strokeContrast]) * 8;
  s += Math.abs(xhMap[a.xHeight] - xhMap[b.xHeight]) * 4;
  if (a.subclassification !== b.subclassification) s += 6;
  return s;
}

function compatibilityScore(a: FontRecord, b: FontRecord) {
  let s = 100;
  s -= sameCategoryPenalty(a, b);
  s -= widthClash(a, b);
  s += (a.versatilityScore + b.versatilityScore) / 20;
  // penalize near-twins (no hierarchy)
  s -= similarityIndex(a, b) * 3;
  // shared best-role overlap = redundant
  const roleOverlap = a.bestRoles.filter((r) => b.bestRoles.includes(r)).length;
  s -= roleOverlap * 4;
  return s;
}

function reliableScore(primary: FontRecord, secondary: FontRecord) {
  let s = compatibilityScore(primary, secondary);
  s += secondary.readabilityScore / 4;
  s += secondary.bodyTextScore / 5;
  s += secondary.uiScore / 8;
  if (secondary.pairingDifficulty === "Easy") s += 8;
  if (secondary.pairingDifficulty === "Hard") s -= 12;
  if (secondary.classification === "Display") s -= 40;
  if (secondary.readabilityScore < 75) s -= 20;
  if (secondary.bodyTextScore < 75) s -= 12;
  // weakRoles guard: never recommend body/UI if listed as weak
  if (secondary.weakRoles.some((r) => /body|UI/i.test(r))) s -= 14;
  // print/screen alignment helps system coherence
  s -= Math.abs(primary.printScore - secondary.printScore) / 10;
  s -= Math.abs(primary.screenScore - secondary.screenScore) / 10;
  return s;
}

function editorialScore(primary: FontRecord, secondary: FontRecord) {
  let s = compatibilityScore(primary, secondary) * 0.6;
  s += contrastScore(primary, secondary) * 0.8;
  s += secondary.displayScore / 6;
  s += secondary.readabilityScore / 8;
  // editorial benefits from a strong contrastTolerance
  if (secondary.contrastTolerance === "High") s += 6;
  if (secondary.classification === "Display" && secondary.displayScore > 88) s += 10;
  if (primary.classification === secondary.classification) s -= 18;
  // avoid two competing display voices
  if (competesForAttention(primary, secondary)) s -= 20;
  return s;
}

function experimentalScore(primary: FontRecord, secondary: FontRecord) {
  let s = contrastScore(primary, secondary) * 1.2;
  s += secondary.displayScore / 5;
  if (secondary.personality.some((p) => /expressive|characterful|quirky|retro|playful|warm/i.test(p))) s += 10;
  if (secondary.classification === "Display" || secondary.classification === "Mono") s += 8;
  if (secondary.personality.includes("neutral")) s -= 12;
  // reward genuinely distinct sub-classification
  if (primary.subclassification !== secondary.subclassification) s += 6;
  // but still cap pure noise: if both fonts have <60 body/<60 ui, no usable hierarchy
  if (secondary.bodyTextScore < 50 && primary.bodyTextScore < 50) s -= 10;
  return s;
}

function pickRole(primary: FontRecord, secondary: FontRecord): [string, string] {
  // primary is usually display/headline; secondary supports body / UI / accents
  const primaryRole =
    primary.displayScore >= primary.bodyTextScore ? "Headlines & display" : "Body & primary text";
  let secondaryRole: string;
  if (secondary.classification === "Mono") secondaryRole = "Labels, captions, technical accents";
  else if (secondary.bodyTextScore >= 85 && secondary.readabilityScore >= 80)
    secondaryRole = "Body text & long-form";
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
  const similarity = similarityIndex(primary, secondary);
  const competes = competesForAttention(primary, secondary);
  const supportUnfit = unfitForSupport(secondary);

  let riskLevel: Pairing["riskLevel"];
  if (category === "Reliable System Pairing") riskLevel = sameCat ? "Medium" : "Low";
  else if (category === "Editorial Contrast Pairing") riskLevel = "Medium";
  else riskLevel = "High";
  if (similarity >= 6) riskLevel = "High";
  if (competes) riskLevel = "High";

  // normalize confidence to 0-100
  let confidence = Math.max(35, Math.min(98, Math.round(rawScore)));
  if (similarity >= 6) confidence = Math.min(confidence, 55);
  if (competes) confidence = Math.min(confidence, 50);
  if (category === "Reliable System Pairing" && supportUnfit)
    confidence = Math.min(confidence, 55);

  const contrastType = sameCat
    ? "Structural contrast within the same category"
    : `Category contrast — ${primary.classification.toLowerCase()} vs ${secondary.classification.toLowerCase()}`;

  // base explanation, plus warnings appended when relevant
  const warnings: string[] = [];
  if (similarity >= 6) {
    warnings.push(
      `${primary.name} and ${secondary.name} share too many structural traits (classification, x-height and contrast) — hierarchy will not emerge from form alone, so it must be carried by size, weight and spacing.`,
    );
  }
  if (competes) {
    warnings.push(
      `Both fonts behave as display voices with limited body-text performance — they compete for attention. Assign strict roles and keep one of them small.`,
    );
  }
  if (category === "Reliable System Pairing" && supportUnfit) {
    warnings.push(
      `${secondary.name} is not a strong choice for body or UI text (readability ${secondary.readabilityScore}, body ${secondary.bodyTextScore}). Use a different secondary for system reliability.`,
    );
  }
  if (
    secondaryRole.startsWith("Body") &&
    secondary.weakRoles.some((r) => /body/i.test(r))
  ) {
    warnings.push(
      `${secondary.name} lists body text in its weak roles — avoid using it for long-form reading even if scores allow it.`,
    );
  }

  const explanation =
    explain(category, primary, secondary)! +
    (warnings.length ? ` ⚠ ${warnings.join(" ")}` : "") +
    (isPremiumReference(secondary)
      ? ` Note — ${secondary.name} is a premium reference and requires a commercial license. This is a conceptual pairing reference; verify licensing before use.`
      : "");

  const freeAlt = isPremiumReference(secondary)
    ? (secondary.freeAlternatives ?? [])
        .map((id) => FONTS_BY_ID[id])
        .find((f) => f && !isPremiumReference(f)) ?? null
    : null;

  const licenseRequired =
    isPremiumReference(primary) || isPremiumReference(secondary);

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
    explanation,
    freeAlternative: freeAlt,
    licenseRequired,
  };
}

export function buildRecommendations(primary: FontRecord): Pairing[] {
  // Pre-filter the universe to keep the recommendations defensible.
  // Reliable system pairings prefer fonts the user can actually use without
  // a commercial license — premium references are excluded.
  const reliablePool = FONTS.filter(
    (f) =>
      f.id !== primary.id &&
      f.classification !== "Display" &&
      f.readabilityScore >= 80 &&
      f.bodyTextScore >= 70 &&
      !isPremiumReference(f),
  );
  // Editorial and experimental pools may include premium references, but
  // they are flagged and shown with a free alternative.
  const editorialPool = FONTS.filter((f) => f.id !== primary.id);
  const experimentalPool = FONTS.filter(
    (f) => f.id !== primary.id && (f.displayScore >= 75 || f.classification === "Mono"),
  );

  const rankIn = (
    pool: FontRecord[],
    score: (a: FontRecord, b: FontRecord) => number,
  ) =>
    pool
      .map((f) => ({ f, score: score(primary, f) }))
      .sort((a, b) => b.score - a.score);

  const reliable = rankIn(reliablePool.length ? reliablePool : FONTS.filter((f) => f.id !== primary.id), reliableScore);
  const editorial = rankIn(editorialPool, editorialScore);
  const experimental = rankIn(experimentalPool.length ? experimentalPool : editorialPool, experimentalScore);

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

/* ------------------------------------------------------------------
 * Side-by-side comparator — same attribute logic, simplified output.
 * ------------------------------------------------------------------ */

export interface ComparisonResult {
  canWorkTogether: "Yes" | "Yes, with caution" | "Not recommended";
  riskLevel: "Low" | "Medium" | "High";
  roleSeparation: string;
  why: string;
  freeAlternatives: { for: FontRecord; alternatives: FontRecord[] }[];
  licensingFlag: string | null;
}

export function compareFonts(a: FontRecord, b: FontRecord): ComparisonResult {
  const similarity = similarityIndex(a, b);
  const competes = competesForAttention(a, b);
  const contrast = contrastScore(a, b);

  let canWork: ComparisonResult["canWorkTogether"];
  let risk: ComparisonResult["riskLevel"];

  if (similarity >= 7) {
    canWork = "Not recommended";
    risk = "High";
  } else if (similarity >= 5 || competes) {
    canWork = "Yes, with caution";
    risk = "High";
  } else if (contrast >= 30) {
    canWork = "Yes";
    risk = "Low";
  } else {
    canWork = "Yes, with caution";
    risk = "Medium";
  }

  // Role separation
  let roleSeparation: string;
  if (a.classification === "Display" && b.bodyTextScore >= 80) {
    roleSeparation = `${a.name} for headlines & display, ${b.name} for body & UI.`;
  } else if (b.classification === "Display" && a.bodyTextScore >= 80) {
    roleSeparation = `${b.name} for headlines & display, ${a.name} for body & UI.`;
  } else if (a.uiScore >= 88 && b.displayScore >= 80) {
    roleSeparation = `${a.name} for UI / system text, ${b.name} for editorial headlines.`;
  } else if (b.uiScore >= 88 && a.displayScore >= 80) {
    roleSeparation = `${b.name} for UI / system text, ${a.name} for editorial headlines.`;
  } else if (a.bodyTextScore > b.bodyTextScore) {
    roleSeparation = `${b.name} for headlines, ${a.name} for supporting body text.`;
  } else {
    roleSeparation = `${a.name} for headlines, ${b.name} for supporting body text.`;
  }

  // Why
  const reasons: string[] = [];
  if (a.classification !== b.classification) {
    reasons.push(
      `Category contrast: ${a.classification.toLowerCase()} against ${b.classification.toLowerCase()} creates clear visual separation.`,
    );
  } else {
    reasons.push(
      `Same-category pairing — contrast must come from weight, scale and spacing rather than form.`,
    );
  }
  if (a.xHeight !== b.xHeight) {
    reasons.push(`Different x-heights (${a.xHeight} vs ${b.xHeight}) help visual hierarchy at small sizes.`);
  }
  if (a.strokeContrast !== b.strokeContrast) {
    reasons.push(`Stroke-contrast difference (${a.strokeContrast} vs ${b.strokeContrast}) adds formal contrast.`);
  }
  if (competes) {
    reasons.push(`Both fonts behave as display voices — they compete for attention and need strict role separation.`);
  }
  if (similarity >= 5) {
    reasons.push(`Structural similarity is high — hierarchy will not emerge from form alone.`);
  }

  // Free alternatives where applicable
  const freeAlternatives: ComparisonResult["freeAlternatives"] = [];
  for (const font of [a, b]) {
    if (isPremiumReference(font)) {
      const alts = (font.freeAlternatives ?? [])
        .map((id) => FONTS_BY_ID[id])
        .filter((x): x is FontRecord => Boolean(x) && !isPremiumReference(x))
        .slice(0, 4);
      if (alts.length) freeAlternatives.push({ for: font, alternatives: alts });
    }
  }

  let licensingFlag: string | null = null;
  if (isPremiumReference(a) || isPremiumReference(b)) {
    licensingFlag =
      "This is a conceptual pairing reference. Verify licensing before use — at least one font requires a commercial license.";
  }

  return {
    canWorkTogether: canWork,
    riskLevel: risk,
    roleSeparation,
    why: reasons.join(" "),
    freeAlternatives,
    licensingFlag,
  };
}