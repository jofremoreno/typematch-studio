import { useMemo, useState } from "react";
import { buildRecommendations, buildExtendedRecommendations, type Pairing } from "@/lib/pairing";
import type { FontRecord } from "@/data/fonts";
import { PairingCard } from "./pairing-card";

export function PairingRecommendations({ font }: { font: FontRecord }) {
  const base = useMemo(() => buildRecommendations(font), [font]);
  const [extra, setExtra] = useState<Pairing[]>([]);
  const [exhausted, setExhausted] = useState(false);

  const pairings: Pairing[] = [...base, ...extra];

  const loadMore = () => {
    const excludeIds = new Set<string>(pairings.map((p) => p.secondary.id));
    excludeIds.add(font.id);
    const next = buildExtendedRecommendations(font, excludeIds, 1);
    const fresh = next.filter((p) => !pairings.some((existing) => existing.name === p.name));
    if (!fresh.length) {
      setExhausted(true);
      return;
    }
    setExtra((prev) => [...prev, ...fresh]);
  };

  return (
    <section className="border-b border-border py-20">
      <div className="mb-12 max-w-3xl">
        <span className="label-eyebrow">04 — Pairing recommendations</span>
        <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
          Three pairings, three intentions.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Each recommendation is built from {font.name}'s attributes against the
          local library. The first is a safe system pairing, the second leans
          editorial, the third trades safety for character.
        </p>
      </div>
      <div className="grid-pairings">
        {pairings.map((p, i) => (
          <PairingCard key={p.name} pairing={p} index={i} />
        ))}
      </div>
      <div className="mt-12 flex items-center justify-center">
        {exhausted ? (
          <p className="text-xs text-muted-foreground">
            No more pairings available for this typeface yet.
          </p>
        ) : (
          <button
            type="button"
            onClick={loadMore}
            className="border border-border bg-card px-5 py-2 text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground hover:bg-secondary"
          >
            Show more pairings
          </button>
        )}
      </div>
    </section>
  );
}