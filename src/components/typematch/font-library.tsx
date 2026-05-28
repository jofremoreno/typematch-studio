import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FONTS, type FontCategory, type Suitability } from "@/data/fonts";

type Filter = "All" | FontCategory | "Best for screen" | "Best for print" | "Best for both";

const FILTERS: Filter[] = [
  "All",
  "Sans-serif",
  "Serif",
  "Mono",
  "Display",
  "Best for screen",
  "Best for print",
  "Best for both",
];

const mediumMap: Record<string, Suitability> = {
  "Best for screen": "Screen",
  "Best for print": "Print",
  "Best for both": "Both",
};

export function FontLibrary() {
  const [filter, setFilter] = useState<Filter>("All");

  const fonts = useMemo(() => {
    if (filter === "All") return FONTS;
    if (filter in mediumMap) return FONTS.filter((f) => f.bestMedium === mediumMap[filter]);
    return FONTS.filter((f) => f.classification === filter);
  }, [filter]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-y border-border py-4">
        <span className="label-eyebrow mr-2">Filter</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "border px-3 py-1.5 text-xs transition-colors " +
              (filter === f
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:text-foreground")
            }
          >
            {f}
          </button>
        ))}
        <span className="ml-auto font-mono-ui text-xs text-muted-foreground">
          {fonts.length} / {FONTS.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {fonts.map((f, i) => (
          <article
            key={f.id}
            className={
              "group flex flex-col justify-between gap-6 border-border bg-card p-6 transition-colors hover:bg-secondary " +
              "border-b " +
              ((i + 1) % 3 !== 0 ? "lg:border-r " : "") +
              ((i + 1) % 2 !== 0 ? "sm:border-r lg:border-r " : "")
            }
          >
            <header className="flex items-center justify-between">
              <span className="label-eyebrow">{f.classification}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Free · {f.sourceName}
              </span>
            </header>
            <p
              className="text-5xl leading-none tracking-tight"
              style={{ fontFamily: f.family }}
            >
              {f.name}
            </p>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {f.personality.slice(0, 3).map((p) => (
                  <span key={p} className="border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {p}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Best for {f.bestMedium.toLowerCase()}</span>
                <Link
                  to="/"
                  search={{ q: f.name } as never}
                  className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
                >
                  Analyze →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}