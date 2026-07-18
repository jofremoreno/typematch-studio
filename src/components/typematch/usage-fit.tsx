import type { FontRecord } from "@/data/fonts";
import { ScoreBar } from "./score-bar";

const captions = (f: FontRecord) => ({
  ui:
    f.uiScore >= 85
      ? "Highly suitable for dense interface text and labels."
      : f.uiScore >= 70
        ? "Works in UI with care around small sizes and spacing."
        : "Not ideal for interface text — use for accent only.",
  body:
    f.bodyTextScore >= 85
      ? "Strong long-form reading performance."
      : f.bodyTextScore >= 70
        ? "Acceptable for short body passages."
        : "Avoid for sustained reading.",
  display:
    f.displayScore >= 85
      ? "Performs strongly at headline and poster scale."
      : f.displayScore >= 70
        ? "Holds up at medium display sizes."
        : "Lacks the expressive character needed at display sizes.",
  print:
    f.printScore >= 85
      ? "Refined behaviour in print at body and display sizes."
      : f.printScore >= 70
        ? "Print-capable, but pick weights carefully."
        : "Optimized primarily for screens.",
  screen:
    f.screenScore >= 85
      ? "Excellent rendering on backlit displays at small sizes."
      : f.screenScore >= 70
        ? "Reliable on screens at medium sizes."
        : "Better suited to print contexts.",
  versatility:
    f.versatilityScore >= 85
      ? "A versatile system typeface across contexts."
      : f.versatilityScore >= 70
        ? "Versatile within its primary use case."
        : "Specialized — use intentionally, not as a default.",
});

export function UsageFit({ font }: { font: FontRecord }) {
  const c = captions(font);
  const scores = [
    ["UI", font.uiScore, c.ui],
    ["Body text", font.bodyTextScore, c.body],
    ["Display", font.displayScore, c.display],
    ["Print", font.printScore, c.print],
    ["Screen", font.screenScore, c.screen],
    ["Versatility", font.versatilityScore, c.versatility],
  ] as const;
  return (
    <section className="tm-analysis-card tm-usage-section">
      <div className="tm-section-heading">
        <div>
          <span className="label-eyebrow">06 — Usage fit</span>
          <h2 className="mt-3">Where {font.name} earns its place.</h2>
        </div>
        <p>
          Scores reflect the font's behaviour in each role, derived from its x-height, aperture,
          contrast and rhythm — not from popularity.
        </p>
      </div>
      <div className="tm-usage-grid">
        {scores.map(([label, value, caption], index) => (
          <article key={label} className="tm-usage-score">
            <span className="font-mono-ui">0{index + 1}</span>
            <ScoreBar label={label} value={value} caption={caption} />
          </article>
        ))}
      </div>
    </section>
  );
}
