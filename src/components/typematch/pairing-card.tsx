import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Pairing } from "@/lib/pairing";
import { pairingReasons } from "@/lib/pairing";
import { useSavedPairings } from "@/lib/saved-pairings";
import {
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { LicenseBadges } from "./license-badges";
import type { FontRecord } from "@/data/fonts";
import { useFontPreview } from "@/hooks/use-font-preview";

function SourceLink({ font }: { font: FontRecord }) {
  if (!font.sourceUrl) return null;
  return (
    <a href={font.sourceUrl} target="_blank" rel="noreferrer" className="tm-pairing-source-link">
      {font.name} source
      <ExternalLink size={12} aria-hidden="true" />
    </a>
  );
}

function riskTone(level: Pairing["riskLevel"]) {
  if (level === "High") return "high";
  if (level === "Medium") return "medium";
  return "low";
}

function PairingSpecimenControls({
  fontName,
  size,
  leading,
  spacing,
  onSizeChange,
  onLeadingChange,
  onSpacingChange,
  onReset,
}: {
  fontName: string;
  size: number;
  leading: number;
  spacing: number;
  onSizeChange: (value: number) => void;
  onLeadingChange: (value: number) => void;
  onSpacingChange: (value: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="tm-pairing-specimen-controls">
      <label>
        <span>Size</span>
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
        <span>Leading</span>
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
        <span>Spacing</span>
        <input
          type="range"
          min="-20"
          max="100"
          value={spacing}
          onChange={(event) => onSpacingChange(Number(event.target.value))}
        />
        <output>{spacing}</output>
      </label>
      <button type="button" onClick={onReset} aria-label={`Reset ${fontName} pairing specimen`}>
        <RotateCcw size={12} aria-hidden="true" />
      </button>
    </div>
  );
}

export function PairingCard({
  pairing,
  onGenerate,
  canGenerate,
}: {
  pairing: Pairing;
  onGenerate: () => void;
  canGenerate: boolean;
}) {
  const { primary, secondary } = pairing;
  const { save, isSaved } = useSavedPairings();
  const saved = isSaved(pairing);
  const reasons = pairingReasons(pairing);
  const primaryPreview = useFontPreview(primary);
  const secondaryPreview = useFontPreview(secondary);
  const primaryFamily = primaryPreview.family;
  const secondaryFamily = secondaryPreview.family;
  const [primaryText, setPrimaryText] = useState("A measured form");
  const [secondaryText, setSecondaryText] = useState(
    "Typography creates hierarchy through contrast, rhythm and scale.",
  );
  const [primarySize, setPrimarySize] = useState(72);
  const [secondarySize, setSecondarySize] = useState(38);
  const [primaryLeading, setPrimaryLeading] = useState(86);
  const [secondaryLeading, setSecondaryLeading] = useState(112);
  const [primarySpacing, setPrimarySpacing] = useState(0);
  const [secondarySpacing, setSecondarySpacing] = useState(0);

  return (
    <article className="tm-pairing-card" data-featured="true" aria-live="polite">
      <header className="tm-pairing-card-header">
        <span className="label-eyebrow">01 — Recommended pairing</span>
        <div className="tm-pairing-card-status">
          <button
            type="button"
            onClick={onGenerate}
            disabled={!canGenerate}
            className="tm-generate-pairing"
          >
            <RefreshCw size={12} aria-hidden="true" />
            Generate new pairing
          </button>
          <span className="tm-pairing-confidence">
            <span>Match</span>
            {pairing.confidence}
          </span>
          <span className="tm-pairing-risk" data-risk={riskTone(pairing.riskLevel)}>
            {pairing.riskLevel} risk
          </span>
        </div>
      </header>

      <div className="tm-featured-pairing-stage">
        <div className="tm-featured-pairing-primary">
          <div className="tm-featured-pairing-label">
            <span className="tm-compare-specimen-index">A</span>
            <div>
              <span className="label-eyebrow">Primary voice</span>
              <p>{pairing.primaryRole}</p>
            </div>
          </div>
          <PairingSpecimenControls
            fontName={primary.name}
            size={primarySize}
            leading={primaryLeading}
            spacing={primarySpacing}
            onSizeChange={setPrimarySize}
            onLeadingChange={setPrimaryLeading}
            onSpacingChange={setPrimarySpacing}
            onReset={() => {
              setPrimaryText("A measured form");
              setPrimarySize(72);
              setPrimaryLeading(86);
              setPrimarySpacing(0);
            }}
          />
          <textarea
            className="tm-featured-pairing-display"
            value={primaryText}
            onChange={(event) => setPrimaryText(event.target.value)}
            spellCheck={false}
            aria-label={`Editable pairing specimen for ${primary.name}`}
            style={{
              fontFamily: primaryFamily,
              fontSize: `${primarySize}px`,
              lineHeight: `${primaryLeading}%`,
              letterSpacing: `${primarySpacing}px`,
            }}
          />
          <div className="tm-featured-pairing-font">
            <strong style={{ fontFamily: primaryFamily }}>{primary.name}</strong>
            <LicenseBadges font={primary} compact />
          </div>
        </div>

        <div className="tm-featured-pairing-secondary">
          <div className="tm-featured-pairing-label">
            <span className="tm-compare-specimen-index">B</span>
            <div>
              <span className="label-eyebrow">Supporting voice</span>
              <p>{pairing.secondaryRole}</p>
            </div>
          </div>
          <PairingSpecimenControls
            fontName={secondary.name}
            size={secondarySize}
            leading={secondaryLeading}
            spacing={secondarySpacing}
            onSizeChange={setSecondarySize}
            onLeadingChange={setSecondaryLeading}
            onSpacingChange={setSecondarySpacing}
            onReset={() => {
              setSecondaryText("Typography creates hierarchy through contrast, rhythm and scale.");
              setSecondarySize(38);
              setSecondaryLeading(112);
              setSecondarySpacing(0);
            }}
          />
          <textarea
            className="tm-featured-pairing-copy"
            value={secondaryText}
            onChange={(event) => setSecondaryText(event.target.value)}
            spellCheck={false}
            aria-label={`Editable pairing specimen for ${secondary.name}`}
            style={{
              fontFamily: secondaryFamily,
              fontSize: `${secondarySize}px`,
              lineHeight: `${secondaryLeading}%`,
              letterSpacing: `${secondarySpacing}px`,
            }}
          />
          <div className="tm-featured-pairing-font">
            <strong style={{ fontFamily: secondaryFamily }}>{secondary.name}</strong>
            <LicenseBadges font={secondary} compact />
          </div>
        </div>
      </div>

      <div className="tm-pairing-rationale">
        <div>
          <span className="label-eyebrow">Pairing intention</span>
          <h3>{pairing.name}</h3>
        </div>
        <p>{pairing.explanation}</p>
      </div>

      <ul className="tm-pairing-reasons" aria-label="Key pairing reasons">
        {reasons.slice(0, 3).map((reason) => (
          <li key={reason.label}>
            <span>{reason.label}</span>
            <p>{reason.detail}</p>
          </li>
        ))}
      </ul>

      {pairing.licenseRequired && pairing.freeAlternative && (
        <div className="tm-pairing-license-note">
          <span className="label-eyebrow">Free alternative</span>
          <Link
            to="/analyze"
            search={{ font: pairing.freeAlternative.id }}
            style={{ fontFamily: pairing.freeAlternative.family }}
          >
            {pairing.freeAlternative.name}
          </Link>
          <span>can perform a similar functional role.</span>
        </div>
      )}

      <details className="tm-pairing-details">
        <summary>
          View pairing criteria
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="tm-pairing-details-grid">
          <dl>
            <div>
              <dt>Contrast</dt>
              <dd>{pairing.contrastType}</dd>
            </div>
            <div>
              <dt>Formal relationship</dt>
              <dd>{pairing.formalRelationship}</dd>
            </div>
            <div>
              <dt>Personality</dt>
              <dd>{pairing.personalityRelationship}</dd>
            </div>
          </dl>
          <div className="tm-pairing-use-cases">
            <div>
              <span className="label-eyebrow">Works for</span>
              <p>{pairing.bestUseCases.join(" · ")}</p>
            </div>
            <div>
              <span className="label-eyebrow">Avoid for</span>
              <p>{pairing.avoidUseCases.join(" · ")}</p>
            </div>
          </div>
        </div>
        <div className="tm-pairing-sources">
          <SourceLink font={primary} />
          <SourceLink font={secondary} />
        </div>
      </details>

      <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Link
          to="/analyze"
          search={{ font: primary.id, with: secondary.id }}
          hash="compare"
          className="btn-card-secondary justify-center"
        >
          Compare this pairing
        </Link>
        <button
          type="button"
          onClick={() => !saved && save(pairing)}
          disabled={saved}
          aria-pressed={saved}
          className="btn-card-primary w-full disabled:cursor-default disabled:opacity-70"
        >
          {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {saved ? "Pairing saved" : "Save pairing"}
        </button>
      </div>
    </article>
  );
}
