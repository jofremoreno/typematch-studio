import { useSavedPairings } from "@/lib/saved-pairings";
import { FONTS_BY_ID } from "@/data/fonts";
import { X, Bookmark } from "lucide-react";

export function SavedPairings() {
  const { items, remove } = useSavedPairings();

  return (
    <section className="border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="label-eyebrow">Saved pairings</span>
          <h2 className="font-editorial mt-2 text-2xl tracking-tight">
            Your local shortlist
          </h2>
        </div>
        <p className="max-w-md text-xs text-muted-foreground">
          Stored only in this browser via localStorage. No account, no sync, no
          backend.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 flex items-center gap-3 border border-dashed border-border bg-background p-5 text-xs text-muted-foreground">
          <Bookmark size={14} />
          No saved pairings yet. Use <span className="text-foreground">Save pairing</span> on any recommendation to keep it here.
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((it) => {
            const primary = FONTS_BY_ID[it.primaryId];
            const secondary = FONTS_BY_ID[it.secondaryId];
            const pFamily =
              primary && primary.canPreviewInApp !== false
                ? primary.family
                : "ui-sans-serif, system-ui, sans-serif";
            const sFamily =
              secondary && secondary.canPreviewInApp !== false
                ? secondary.family
                : "ui-sans-serif, system-ui, sans-serif";
            return (
              <li
                key={it.id}
                className="flex flex-col gap-3 border border-border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="label-eyebrow">{it.category}</span>
                    <p className="mt-1 text-lg" style={{ fontFamily: pFamily }}>
                      {it.primaryName}
                    </p>
                    <p
                      className="text-sm text-muted-foreground"
                      style={{ fontFamily: sFamily }}
                    >
                      + {it.secondaryName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(it.id)}
                    aria-label="Remove saved pairing"
                    className="inline-flex items-center gap-1 border border-border bg-card px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-foreground hover:text-foreground"
                  >
                    <X size={11} /> Remove
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>Risk · {it.riskLevel}</span>
                  <span>Confidence · {it.confidence}</span>
                </div>

                <p className="text-xs leading-relaxed text-foreground">
                  {it.shortExplanation}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}