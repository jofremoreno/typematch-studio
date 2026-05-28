import type { FontRecord } from "@/data/fonts";
import { analyzeContrastBehaviour } from "@/lib/pairing";
import { Badge } from "./badge";

export function ContrastBehaviour({ font }: { font: FontRecord }) {
  const items = analyzeContrastBehaviour(font);
  return (
    <section className="border-b border-border py-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="label-eyebrow">05 — Contrast behaviour</span>
          <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
            How {font.name} behaves under contrast.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Contrast tolerance: <span className="text-foreground">{font.contrastTolerance}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((c) => (
          <article key={c.level} className="flex flex-col gap-3 border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="label-eyebrow">{c.level}</span>
              <Badge variant={c.risk === "High" ? "accent" : c.risk === "Medium" ? "default" : "outline"}>
                Risk {c.risk}
              </Badge>
            </div>
            <p className="text-sm text-foreground">
              <span className="label-eyebrow block mb-1">When it works</span>
              {c.whenWorks}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="label-eyebrow block mb-1">When it fails</span>
              {c.whenFails}
            </p>
            <p className="mt-auto border-t border-border pt-3 text-xs leading-relaxed text-foreground">
              {c.recommendation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}