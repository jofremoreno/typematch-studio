import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { FONTS, FONTS_BY_ID, type FontRecord } from "@/data/fonts";
import { buildRecommendations, compareFonts } from "@/lib/pairing";
import { useFontPreview } from "@/hooks/use-font-preview";
import { LicenseBadges } from "./license-badges";

const PRIMARY_TEXT = "A measured form";
const SECONDARY_TEXT = "Clear supporting text creates rhythm, hierarchy and contrast.";

export function InlineFontComparison({
  font,
  initialSecondaryId,
}: {
  font: FontRecord;
  initialSecondaryId?: string;
}) {
  const recommended = useMemo(() => buildRecommendations(font)[0]?.secondary, [font]);
  const initialSecondary =
    (initialSecondaryId && FONTS_BY_ID[initialSecondaryId]?.id !== font.id
      ? FONTS_BY_ID[initialSecondaryId]
      : null) ??
    recommended ??
    FONTS.find((candidate) => candidate.id !== font.id) ??
    font;
  const [secondaryId, setSecondaryId] = useState(initialSecondary.id);
  const [primaryText, setPrimaryText] = useState(PRIMARY_TEXT);
  const [secondaryText, setSecondaryText] = useState(SECONDARY_TEXT);
  const [primarySize, setPrimarySize] = useState(72);
  const [secondarySize, setSecondarySize] = useState(52);
  const [primaryLeading, setPrimaryLeading] = useState(95);
  const [secondaryLeading, setSecondaryLeading] = useState(112);
  const [primarySpacing, setPrimarySpacing] = useState(0);
  const [secondarySpacing, setSecondarySpacing] = useState(0);

  const secondary = FONTS_BY_ID[secondaryId] ?? initialSecondary;
  const result = useMemo(() => compareFonts(font, secondary), [font, secondary]);

  return (
    <section id="compare" className="tm-analysis-card tm-inline-compare scroll-mt-36">
      <div className="tm-section-heading">
        <div>
          <span className="label-eyebrow">02 — Direct comparison</span>
          <h2 className="mt-3">Compare without leaving the specimen page.</h2>
        </div>
        <div className="tm-inline-compare-select">
          <label htmlFor="inline-compare-font" className="label-eyebrow">
            Compare {font.name} with
          </label>
          <select
            id="inline-compare-font"
            value={secondary.id}
            onChange={(event) => setSecondaryId(event.target.value)}
          >
            {FONTS.filter((candidate) => candidate.id !== font.id).map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tm-inline-compare-stage">
        <InlineSpecimen
          label="A"
          font={font}
          text={primaryText}
          size={primarySize}
          leading={primaryLeading}
          spacing={primarySpacing}
          onTextChange={setPrimaryText}
          onSizeChange={setPrimarySize}
          onLeadingChange={setPrimaryLeading}
          onSpacingChange={setPrimarySpacing}
          onReset={() => {
            setPrimaryText(PRIMARY_TEXT);
            setPrimarySize(72);
            setPrimaryLeading(95);
            setPrimarySpacing(0);
          }}
        />
        <InlineSpecimen
          label="B"
          font={secondary}
          text={secondaryText}
          size={secondarySize}
          leading={secondaryLeading}
          spacing={secondarySpacing}
          onTextChange={setSecondaryText}
          onSizeChange={setSecondarySize}
          onLeadingChange={setSecondaryLeading}
          onSpacingChange={setSecondarySpacing}
          onReset={() => {
            setSecondaryText(SECONDARY_TEXT);
            setSecondarySize(52);
            setSecondaryLeading(112);
            setSecondarySpacing(0);
          }}
        />
      </div>

      <div className="tm-inline-compare-verdict" data-risk={result.riskLevel.toLowerCase()}>
        <div>
          <span className="label-eyebrow">Verdict</span>
          <strong>{result.canWorkTogether}</strong>
        </div>
        <div>
          <span className="label-eyebrow">Recommended hierarchy</span>
          <p>{result.roleSeparation}</p>
        </div>
        <div>
          <span className="label-eyebrow">Why</span>
          <p>{result.why}</p>
        </div>
        <div className="tm-inline-compare-risk">
          <span className="label-eyebrow">Risk</span>
          <strong>{result.riskLevel}</strong>
        </div>
      </div>

      <div className="tm-inline-compare-scores" aria-label="Role score comparison">
        <ScorePair label="Display" primary={font.displayScore} secondary={secondary.displayScore} />
        <ScorePair label="Body" primary={font.bodyTextScore} secondary={secondary.bodyTextScore} />
        <ScorePair label="UI" primary={font.uiScore} secondary={secondary.uiScore} />
        <ScorePair
          label="Readability"
          primary={font.readabilityScore}
          secondary={secondary.readabilityScore}
        />
      </div>
    </section>
  );
}

function InlineSpecimen({
  label,
  font,
  text,
  size,
  leading,
  spacing,
  onTextChange,
  onSizeChange,
  onLeadingChange,
  onSpacingChange,
  onReset,
}: {
  label: "A" | "B";
  font: FontRecord;
  text: string;
  size: number;
  leading: number;
  spacing: number;
  onTextChange: (value: string) => void;
  onSizeChange: (value: number) => void;
  onLeadingChange: (value: number) => void;
  onSpacingChange: (value: number) => void;
  onReset: () => void;
}) {
  const preview = useFontPreview(font);
  return (
    <article className="tm-inline-specimen">
      <header>
        <span className="tm-compare-specimen-index">{label}</span>
        <div>
          <span className="label-eyebrow">{font.classification}</span>
          <h3>{font.name}</h3>
          <p>{font.subclassification}</p>
        </div>
        <LicenseBadges font={font} compact />
      </header>
      <div className="tm-inline-specimen-controls">
        <label>
          <span className="label-eyebrow">Text</span>
          <input
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            aria-label={`${font.name} comparison text`}
          />
        </label>
        <label>
          <span className="label-eyebrow">Size</span>
          <input
            type="range"
            min="12"
            max="800"
            value={size}
            onChange={(event) => onSizeChange(Number(event.target.value))}
          />
          <output>{size}</output>
        </label>
        <label>
          <span className="label-eyebrow">Leading</span>
          <input
            type="range"
            min="20"
            max="200"
            value={leading}
            onChange={(event) => onLeadingChange(Number(event.target.value))}
          />
          <output>{leading}</output>
        </label>
        <label>
          <span className="label-eyebrow">Spacing</span>
          <input
            type="range"
            min="-20"
            max="100"
            value={spacing}
            onChange={(event) => onSpacingChange(Number(event.target.value))}
          />
          <output>{spacing}</output>
        </label>
        <button
          type="button"
          onClick={onReset}
          className="tm-specimen-reset"
          aria-label={`Reset ${font.name}`}
        >
          <RotateCcw size={12} aria-hidden="true" />
        </button>
      </div>
      <textarea
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        spellCheck={false}
        aria-label={`Editable specimen for ${font.name}`}
        style={{
          fontFamily: preview.family,
          fontSize: `${size}px`,
          lineHeight: `${leading}%`,
          letterSpacing: `${spacing}px`,
        }}
      />
    </article>
  );
}

function ScorePair({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: number;
  secondary: number;
}) {
  return (
    <div>
      <div>
        <span>{label}</span>
        <span className="font-mono-ui">
          {primary} / {secondary}
        </span>
      </div>
      <span className="tm-inline-score-bar">
        <i style={{ width: `${primary}%` }} />
        <i style={{ width: `${secondary}%` }} />
      </span>
    </div>
  );
}
