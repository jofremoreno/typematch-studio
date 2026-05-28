import type { FontRecord } from "@/data/fonts";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5">
      <span className="label-eyebrow">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

export function TechnicalDiagnosis({ font }: { font: FontRecord }) {
  const rows: [string, string][] = [
    ["Classification", font.classification],
    ["Subclassification", font.subclassification],
    ["X-height", font.xHeight],
    ["Stroke contrast", font.strokeContrast],
    ["Aperture", font.aperture],
    ["Width", font.width],
    ["Rhythm", font.rhythm],
    ["Spacing", font.spacing],
    ["Optical feeling", font.opticalFeeling],
    ["Pairing difficulty", font.pairingDifficulty],
    ["Contrast tolerance", font.contrastTolerance],
  ];

  return (
    <section className="grid grid-cols-1 gap-10 border-b border-border py-12 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <span className="label-eyebrow">02 — Technical diagnosis</span>
        <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
          The anatomy that drives the pairing logic.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Every recommendation below is derived from these attributes. X-height
          and aperture control legibility; stroke contrast and rhythm control
          editorial texture; width and spacing control compatibility with
          neighboring fonts.
        </p>
        <div className="mt-8 border border-border bg-card p-5">
          <span className="label-eyebrow">Why this matters</span>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {font.name} is rated <strong>{font.pairingDifficulty.toLowerCase()}</strong> to
            pair and tolerates {font.contrastTolerance.toLowerCase()} contrast partners.
            Combine it with a typeface from a different classification when you
            need clear role separation; keep it within the same classification
            only when hierarchy is carried by scale and weight, not by form.
          </p>
        </div>
      </div>
      <div>
        {rows.map(([label, value]) => (
          <Row key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}