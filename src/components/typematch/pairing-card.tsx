import type { Pairing } from "@/lib/pairing";
import { Badge } from "./badge";
import { LicenseBadges } from "./license-badges";

function riskColor(level: Pairing["riskLevel"]) {
  if (level === "Low") return "border-border bg-secondary text-foreground";
  if (level === "Medium") return "border-border bg-muted text-foreground";
  return "border-accent bg-accent text-accent-foreground";
}

export function PairingCard({ pairing, index }: { pairing: Pairing; index: number }) {
  const { primary, secondary } = pairing;
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
      </div>
    </article>
  );
}