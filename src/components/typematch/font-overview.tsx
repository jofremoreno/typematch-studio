import type { FontRecord } from "@/data/fonts";
import { PUBLIC_FONTS_BY_ID, isPremiumReference } from "@/data/fonts";
import { Badge } from "./badge";
import { LicenseBadges } from "./license-badges";
import { licensingNotice, sourceButtonLabel } from "./license-utils";
import { ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useFontPreview } from "@/hooks/use-font-preview";

export function FontOverview({ font }: { font: FontRecord }) {
  const preview = useFontPreview(font);
  const notice = licensingNotice(font);
  return (
    <section className="tm-font-hero rounded-xl border border-border bg-card p-6 sm:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{font.classification}</Badge>
            <Badge variant="outline">{font.bestMedium}</Badge>
          </div>
          <LicenseBadges font={font} />
          <h1
            className="text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] tracking-tight"
            style={{ fontFamily: preview.family }}
          >
            {font.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{font.reference}</p>
          {font.foundry && (
            <p className="text-xs text-muted-foreground">Foundry — {font.foundry}</p>
          )}
        </div>
        <div className="flex flex-col items-stretch gap-2">
          <a
            href={font.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground transition-colors hover:border-foreground"
          >
            {sourceButtonLabel(font)} — {font.sourceName}
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {notice && (
        <div className="mt-6 rounded-r-lg border-l-2 border-selection bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">License notice — </strong>
          {notice}
          {font.canPreviewInApp === false &&
            " This preview does not use the actual typeface. It is an informational reference only."}
        </div>
      )}

      <dl className="tm-font-hero-facts">
        <div>
          <dt>Category</dt>
          <dd title={font.subclassification || font.classification}>
            {font.subclassification || font.classification}
          </dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd title={font.foundry ?? font.sourceName}>{font.foundry ?? font.sourceName}</dd>
        </div>
        <div>
          <dt>Preview</dt>
          <dd title={font.canPreviewInApp === false ? "Reference only" : "Live webfont"}>
            {font.canPreviewInApp === false ? "Reference only" : "Live webfont"}
          </dd>
        </div>
        <div>
          <dt>Pairing difficulty</dt>
          <dd title={font.pairingDifficulty}>{font.pairingDifficulty}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        {font.personality.map((p) => (
          <Badge key={p} variant="default">
            {p}
          </Badge>
        ))}
      </div>

      {isPremiumReference(font) && (font.freeAlternatives?.length ?? 0) > 0 && (
        <FreeAlternativesInline font={font} />
      )}
    </section>
  );
}

function FreeAlternativesInline({ font }: { font: FontRecord }) {
  const alts = (font.freeAlternatives ?? []).map((id) => PUBLIC_FONTS_BY_ID[id]).filter(Boolean);
  if (!alts.length) return null;
  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5">
      <span className="label-eyebrow">Free alternatives</span>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Free alternatives with a similar functional role or visual direction. They do not reproduce
        the exact tone or proportions of {font.name}.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {alts.map((a) => (
          <Link
            key={a.id}
            to="/analyze"
            search={{ font: a.id }}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:border-foreground"
            style={{ fontFamily: a.family }}
          >
            {a.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
