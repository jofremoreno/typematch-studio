import type { Pairing } from "@/lib/pairing";
import { pairingReasons } from "@/lib/pairing";
import { useSavedPairings } from "@/lib/saved-pairings";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Badge } from "./badge";
import { LicenseBadges } from "./license-badges";
import { sourceButtonLabel } from "./license-badges";
import type { FontRecord } from "@/data/fonts";

function SourceLink({ font, label }: { font: FontRecord; label: string }) {
  if (!font.sourceUrl) return null;
  return (
    <a
      href={font.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 border border-border bg-background px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground hover:bg-secondary"
    >
      {label} <ExternalLink size={11} />
    </a>
  );
}

function riskColor(level: Pairing["riskLevel"]) {
  if (level === "Low") return "border-border bg-secondary text-foreground";
  if (level === "Medium") return "border-border bg-muted text-foreground";
  return "border-accent bg-accent text-accent-foreground";
}

export function PairingCard({ pairing, index }: { pairing: Pairing; index: number }) {
  const { primary, secondary } = pairing;
  const { save, isSaved } = useSavedPairings();
  const saved = isSaved(pairing);
  const reasons = pairingReasons(pairing);
  const primaryFamily =
    primary.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : primary.family;
  const secondaryFamily =
    secondary.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : secondary.family;
  return (
    <article className="grid grid-cols-1 gap-0 border border-border bg-card lg:grid-cols-[1.05fr_1fr]">
      {/* Preview */}
      <div className="flex flex-col justify-between gap-8 border-b border-border p-7 lg:border-b-0 lg:border-r">
        <div className="flex items-baseline justify-between">
          <span className="label-eyebrow">0{index + 1} — {pairing.category}</span>
          <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${riskColor(pairing.riskLevel)}`}>
            Risk · {pairing.riskLevel}
          </span>
        </div>

        <div>
          <p
            className="text-4xl leading-[1.05] tracking-tight sm:text-5xl"
            style={{ fontFamily: primaryFamily }}
          >
            A measured form
          </p>
          <p
            className="mt-3 text-sm leading-relaxed text-muted-foreground"
            style={{ fontFamily: secondaryFamily }}
          >
            Set in {secondary.name} — supporting copy carries the reading
            rhythm while {primary.name} leads the editorial voice. Hierarchy
            comes from scale, weight and spacing, not decoration.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border pt-5">
          <div>
            <span className="label-eyebrow">Primary</span>
            <p
              className="mt-1 text-xl"
              style={{ fontFamily: primaryFamily }}
            >
              {primary.name}
            </p>
            <p className="text-xs text-muted-foreground">{pairing.primaryRole}</p>
            <div className="mt-2"><LicenseBadges font={primary} compact /></div>
          </div>
          <div>
            <span className="label-eyebrow">Secondary</span>
            <p
              className="mt-1 text-xl"
              style={{ fontFamily: secondaryFamily }}
            >
              {secondary.name}
            </p>
            <p className="text-xs text-muted-foreground">{pairing.secondaryRole}</p>
            <div className="mt-2"><LicenseBadges font={secondary} compact /></div>
          </div>
        </div>
      </div>

      {/* Rationale */}
      <div className="space-y-5 p-7">
        <div className="flex items-baseline justify-between">
          <h3 className="font-editorial text-2xl tracking-tight">{pairing.name}</h3>
          <div className="text-right">
            <span className="label-eyebrow">Confidence</span>
            <p className="font-mono-ui text-lg tabular-nums">{pairing.confidence}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm leading-relaxed">
          <p className="text-foreground">{pairing.explanation}</p>
        </div>

        <div className="border-t border-border pt-4">
          <span className="label-eyebrow">Why this pairing works</span>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed">
            {reasons.map((r) => (
              <li key={r.label} className="text-foreground">
                <span className="font-mono-ui text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {r.label}
                </span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span>{r.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {pairing.licenseRequired && pairing.freeAlternative && (
          <div className="border border-border bg-background p-3 text-xs">
            <span className="label-eyebrow">Free alternative for {pairing.secondary.name}</span>
            <p className="mt-1 text-foreground">
              <a
                href={`/?q=${encodeURIComponent(pairing.freeAlternative.name)}`}
                className="underline-offset-4 hover:underline"
                style={{ fontFamily: pairing.freeAlternative.family }}
              >
                {pairing.freeAlternative.name}
              </a>{" "}
              — similar functional role, no commercial license required.
            </p>
          </div>
        )}

        <dl className="grid grid-cols-1 gap-3 border-t border-border pt-4 text-xs sm:grid-cols-2">
          <div>
            <dt className="label-eyebrow">Contrast</dt>
            <dd className="mt-1 text-foreground">{pairing.contrastType}</dd>
          </div>
          <div>
            <dt className="label-eyebrow">Formal relationship</dt>
            <dd className="mt-1 text-foreground">{pairing.formalRelationship}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="label-eyebrow">Personality</dt>
            <dd className="mt-1 text-foreground">{pairing.personalityRelationship}</dd>
          </div>
        </dl>

        <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 text-xs sm:grid-cols-2">
          <div>
            <span className="label-eyebrow">Works for</span>
            <ul className="mt-2 space-y-1">
              {pairing.bestUseCases.map((u) => (
                <li key={u} className="text-foreground">— {u}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="label-eyebrow">Avoid for</span>
            <ul className="mt-2 space-y-1">
              {pairing.avoidUseCases.map((u) => (
                <li key={u} className="text-muted-foreground">— {u}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-border pt-4">
          <div className="mr-auto flex flex-wrap items-center gap-2">
            <span className="label-eyebrow mr-1">Sources</span>
            <SourceLink font={primary} label={sourceButtonLabel(primary).replace("View ", "Primary — ")} />
            <SourceLink font={secondary} label={sourceButtonLabel(secondary).replace("View ", "Secondary — ")} />
          </div>
          <button
            type="button"
            onClick={() => !saved && save(pairing)}
            disabled={saved}
            aria-pressed={saved}
            className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground disabled:cursor-default disabled:opacity-70"
          >
            {saved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
            {saved ? "Saved" : "Save pairing"}
          </button>
        </div>
      </div>
    </article>
  );
}