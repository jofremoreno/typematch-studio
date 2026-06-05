import { useMemo, useState } from "react";
import { buildRecommendations, buildExtendedRecommendations, type Pairing } from "@/lib/pairing";
import type { FontRecord } from "@/data/fonts";
import { PairingCard } from "./pairing-card";

export function PairingRecommendations({ font }: { font: FontRecord }) {
  const base = useMemo(() => {
    const initial = buildRecommendations(font);
    // Add a fourth pairing — pull one extra recommendation that isn't already
    // chosen, so the section can show 4 cards in a 2×2 grid.
    const usedIds = new Set<string>(initial.map((p) => p.secondary.id));
    usedIds.add(font.id);
    const extra = buildExtendedRecommendations(font, usedIds, 1);
    const fourth = extra.find((p) => !initial.some((e) => e.name === p.name));
    return fourth ? [...initial, fourth] : initial;
  }, [font]);
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
          Four pairings, four intentions.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Each recommendation is built from {font.name}'s attributes against the
          local library — a reliable system pairing, an editorial contrast, an
          experimental high-character pairing, and one further alternative.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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