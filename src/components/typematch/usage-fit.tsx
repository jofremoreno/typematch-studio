import type { FontRecord } from "@/data/fonts";
import { ScoreBar } from "./score-bar";

const captions = (f: FontRecord) => ({
  ui: f.uiScore >= 85
    ? "Highly suitable for dense interface text and labels."
    : f.uiScore >= 70
      ? "Works in UI with care around small sizes and spacing."
      : "Not ideal for interface text — use for accent only.",
  body: f.bodyTextScore >= 85
    ? "Strong long-form reading performance."
    : f.bodyTextScore >= 70
      ? "Acceptable for short body passages."
      : "Avoid for sustained reading.",
  display: f.displayScore >= 85
    ? "Performs strongly at headline and poster scale."
    : f.displayScore >= 70
      ? "Holds up at medium display sizes."
      : "Lacks the expressive character needed at display sizes.",
  print: f.printScore >= 85
    ? "Refined behaviour in print at body and display sizes."
    : f.printScore >= 70
      ? "Print-capable, but pick weights carefully."
      : "Optimized primarily for screens.",
  screen: f.screenScore >= 85
    ? "Excellent rendering on backlit displays at small sizes."
    : f.screenScore >= 70
      ? "Reliable on screens at medium sizes."
      : "Better suited to print contexts.",
  versatility: f.versatilityScore >= 85
    ? "A versatile system typeface across contexts."
    : f.versatilityScore >= 70
      ? "Versatile within its primary use case."
      : "Specialized — use intentionally, not as a default.",
});

export function UsageFit({ font }: { font: FontRecord }) {
  const c = captions(font);
  return (
    <section className="border-b border-border py-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <span className="label-eyebrow">03 — Usage fit</span>
          <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
            Where {font.name} earns its place.
          </h2>
        </div>
        <p className="hidden max-w-sm text-sm text-muted-foreground md:block">
          Scores reflect the font's behaviour in each role, derived from its
          x-height, aperture, contrast and rhythm — not from popularity.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        <ScoreBar label="UI" value={font.uiScore} caption={c.ui} />
        <ScoreBar label="Body text" value={font.bodyTextScore} caption={c.body} />
        <ScoreBar label="Display" value={font.displayScore} caption={c.display} />
        <ScoreBar label="Print" value={font.printScore} caption={c.print} />
        <ScoreBar label="Screen" value={font.screenScore} caption={c.screen} />
        <ScoreBar label="Versatility" value={font.versatilityScore} caption={c.versatility} />
      </div>
    </section>
  );
}