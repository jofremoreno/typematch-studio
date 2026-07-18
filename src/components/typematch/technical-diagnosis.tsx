import type { FontRecord } from "@/data/fonts";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="tm-diagnosis-item">
      <span className="label-eyebrow">{label}</span>
      <span>{value}</span>
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
    <section className="tm-analysis-card tm-diagnosis-section">
      <div className="tm-section-heading">
        <div>
          <span className="label-eyebrow">05 — Technical diagnosis</span>
          <h2 className="mt-3">The anatomy that drives the pairing logic.</h2>
        </div>
        <p>
          Every recommendation above is derived from these attributes. X-height and aperture control
          legibility; stroke contrast and rhythm control editorial texture; width and spacing
          control compatibility with neighboring fonts.
        </p>
      </div>

      <div className="tm-diagnosis-summary">
        <div>
          <span className="label-eyebrow">Pairing difficulty</span>
          <strong title={font.pairingDifficulty}>{font.pairingDifficulty}</strong>
        </div>
        <div>
          <span className="label-eyebrow">Contrast tolerance</span>
          <strong title={font.contrastTolerance}>{font.contrastTolerance}</strong>
        </div>
        <div className="tm-diagnosis-explanation">
          <span className="label-eyebrow">Why this matters</span>
          <p>
            {font.name} is rated <strong>{font.pairingDifficulty.toLowerCase()}</strong> to pair and
            tolerates {font.contrastTolerance.toLowerCase()} contrast partners. Combine it with a
            typeface from a different classification when you need clear role separation; keep it
            within the same classification only when hierarchy is carried by scale and weight, not
            by form.
          </p>
        </div>
      </div>

      <div className="tm-diagnosis-grid">
        {rows.map(([label, value]) => (
          <Row key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}
