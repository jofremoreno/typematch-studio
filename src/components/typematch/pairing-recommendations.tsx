import { useEffect, useMemo, useState } from "react";
import { buildRecommendations, buildExtendedRecommendations } from "@/lib/pairing";
import type { FontRecord } from "@/data/fonts";
import { PairingCard } from "./pairing-card";

export function PairingRecommendations({ font }: { font: FontRecord }) {
  const pairings = useMemo(() => {
    const initial = buildRecommendations(font);
    const usedIds = new Set(initial.map((pairing) => pairing.secondary.id));
    usedIds.add(font.id);
    const extended = buildExtendedRecommendations(font, usedIds, 8);
    return [...initial, ...extended].filter(
      (pairing, index, all) =>
        all.findIndex((candidate) => candidate.secondary.id === pairing.secondary.id) === index,
    );
  }, [font]);
  const [pairingIndex, setPairingIndex] = useState(0);

  useEffect(() => setPairingIndex(0), [font.id]);

  const recommended = pairings[pairingIndex] ?? pairings[0];
  const generatePairing = () => {
    if (pairings.length < 2) return;
    setPairingIndex((current) => (current + 1) % pairings.length);
  };

  return (
    <section className="tm-analysis-card tm-pairing-section py-12 sm:py-16">
      <div className="tm-section-heading">
        <div>
          <span className="label-eyebrow">03 — Pairing recommendations</span>
          <h2 className="mt-3">See the contrast before reading the analysis.</h2>
        </div>
        <p>
          Generate one analyzed pairing at a time. Every result recalculates roles, confidence,
          risk, licensing and technical criteria for {font.name}.
        </p>
      </div>

      {recommended && (
        <PairingCard
          key={font.id}
          pairing={recommended}
          onGenerate={generatePairing}
          canGenerate={pairings.length > 1}
        />
      )}
    </section>
  );
}
