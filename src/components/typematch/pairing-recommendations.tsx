import { buildRecommendations } from "@/lib/pairing";
import type { FontRecord } from "@/data/fonts";
import { PairingCard } from "./pairing-card";

export function PairingRecommendations({ font }: { font: FontRecord }) {
  const pairings = buildRecommendations(font);
  return (
    <section className="border-b border-border py-12">
      <div className="mb-10 max-w-3xl">
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
      <div className="space-y-5">
        {pairings.map((p, i) => (
          <PairingCard key={p.name} pairing={p} index={i} />
        ))}
      </div>
    </section>
  );
}