import type { FontRecord } from "@/data/fonts";
import { Badge } from "./badge";
import { ExternalLink } from "lucide-react";

const WEIGHTS = [300, 400, 500, 600, 700];

export function FontOverview({ font }: { font: FontRecord }) {
  return (
    <section className="border-b border-border pb-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{font.classification}</Badge>
            <Badge variant="muted">License — Free</Badge>
            <Badge variant="outline">{font.bestMedium}</Badge>
          </div>
          <h1
            className="text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] tracking-tight"
            style={{ fontFamily: font.family }}
          >
            {font.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{font.reference}</p>
        </div>
        <a
          href={font.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs text-foreground transition-colors hover:border-foreground"
        >
          {font.sourceName}
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <p
            className="text-3xl leading-snug sm:text-4xl"
            style={{ fontFamily: font.family }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="text-xl text-muted-foreground"
            style={{ fontFamily: font.family }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
            <br />
            0123456789 — &amp; @ # ! ? . , : ;
          </p>
        </div>
        <div className="space-y-3 border-l border-border pl-6">
          <span className="label-eyebrow">Weights</span>
          {WEIGHTS.map((w) => (
            <div
              key={w}
              className="flex items-baseline justify-between gap-4 border-b border-border pb-2"
            >
              <span className="font-mono-ui text-xs text-muted-foreground">{w}</span>
              <span
                className="text-xl"
                style={{ fontFamily: font.family, fontWeight: w }}
              >
                Typography
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {font.personality.map((p) => (
          <Badge key={p} variant="default">
            {p}
          </Badge>
        ))}
      </div>
    </section>
  );
}