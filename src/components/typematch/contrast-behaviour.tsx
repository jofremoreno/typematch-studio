import type { FontRecord } from "@/data/fonts";
import { analyzeContrastBehaviour } from "@/lib/pairing";
import { Badge } from "./badge";

export function ContrastBehaviour({ font }: { font: FontRecord }) {
  const items = analyzeContrastBehaviour(font);
  return (
    <section className="tm-analysis-card tm-contrast-section">
      <div className="tm-section-heading">
        <div>
          <span className="label-eyebrow">07 — Contrast behaviour</span>
          <h2 className="mt-3">How {font.name} behaves under contrast.</h2>
        </div>
        <p>
          Use the three levels as a practical risk scale. The current typeface has{" "}
          <strong>{font.contrastTolerance.toLowerCase()}</strong> contrast tolerance.
        </p>
      </div>
      <div className="tm-contrast-grid">
        {items.map((c, index) => (
          <article key={c.level} className="tm-contrast-card">
            <header>
              <div>
                <span className="font-mono-ui">0{index + 1}</span>
                <h3>{c.level}</h3>
              </div>
              <Badge
                variant={c.risk === "High" ? "accent" : c.risk === "Medium" ? "default" : "outline"}
              >
                Risk {c.risk}
              </Badge>
            </header>
            <div className="tm-contrast-condition">
              <span className="label-eyebrow">When it works</span>
              <p>{c.whenWorks}</p>
            </div>
            <div className="tm-contrast-condition">
              <span className="label-eyebrow">When it fails</span>
              <p>{c.whenFails}</p>
            </div>
            <p className="tm-contrast-recommendation">{c.recommendation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
