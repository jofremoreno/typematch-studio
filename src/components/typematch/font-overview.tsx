import type { FontRecord } from "@/data/fonts";
import { FONTS_BY_ID, isPremiumReference } from "@/data/fonts";
import { Badge } from "./badge";
import {
  LicenseBadges,
  licensingNotice,
  sourceButtonLabel,
} from "./license-badges";
import { ExternalLink, GitCompareArrows } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { FONTS } from "@/data/fonts";
import { useState } from "react";

const WEIGHTS = [300, 400, 500, 600, 700];

export function FontOverview({ font }: { font: FontRecord }) {
  const previewFamily =
    font.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : font.family;
  const notice = licensingNotice(font);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareWith, setCompareWith] = useState<string>(
    FONTS.find((f) => f.id !== font.id)?.id ?? "",
  );
  return (
    <section className="border-b border-border pb-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{font.classification}</Badge>
            <Badge variant="outline">{font.bestMedium}</Badge>
          </div>
          <LicenseBadges font={font} />
          <h1
            className="text-[clamp(3.5rem,10vw,8rem)] leading-[0.95] tracking-tight"
            style={{ fontFamily: previewFamily }}
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
            className="inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs text-foreground transition-colors hover:border-foreground"
          >
            {sourceButtonLabel(font)} — {font.sourceName}
            <ExternalLink size={12} />
          </a>
          <button
            type="button"
            onClick={() => setCompareOpen((v) => !v)}
            className="inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-xs text-foreground transition-colors hover:border-foreground"
            aria-expanded={compareOpen}
          >
            <GitCompareArrows size={12} />
            Compare with another font
          </button>
        </div>
      </div>

      {compareOpen && (
        <div className="mt-6 flex flex-wrap items-end gap-3 border border-border bg-card p-4">
          <label className="flex flex-1 min-w-[220px] flex-col gap-1">
            <span className="label-eyebrow">Compare {font.name} with</span>
            <select
              value={compareWith}
              onChange={(e) => setCompareWith(e.target.value)}
              className="border border-border bg-background px-2 py-2 text-sm text-foreground outline-none"
            >
              {FONTS.filter((f) => f.id !== font.id).map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
          <Link
            to="/compare"
            search={{ a: font.id, b: compareWith }}
            className="border border-foreground bg-foreground px-4 py-2 text-xs uppercase tracking-[0.14em] text-background hover:opacity-90"
          >
            Open comparison →
          </Link>
          <p className="basis-full text-[11px] text-muted-foreground">
            Uses the existing comparator — same local database, no APIs.
          </p>
        </div>
      )}

      {notice && (
        <div className="mt-6 border-l-2 border-accent bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">License notice — </strong>
          {notice}
          {font.canPreviewInApp === false &&
            " This preview does not use the actual typeface. It is an informational reference only."}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <p
            className="text-3xl leading-snug sm:text-4xl"
            style={{ fontFamily: previewFamily }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
          <p
            className="text-xl text-muted-foreground"
            style={{ fontFamily: previewFamily }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
            <br />
            0123456789 — &amp; @ # ! ? . , : ;
          </p>
        </div>
        <div className="space-y-3 border-l border-border pl-6">
          <span className="label-eyebrow">Weights</span>
          {WEIGHTS.map((w) => (
            <div
              key={w}
              className="flex items-baseline justify-between gap-4 border-b border-border pb-2"
            >
              <span className="font-mono-ui text-xs text-muted-foreground">{w}</span>
              <span
                className="text-xl"
                style={{ fontFamily: previewFamily, fontWeight: w }}
              >
                Typography
              </span>
            </div>
          ))}
        </div>
      </div>

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
  const alts = (font.freeAlternatives ?? [])
    .map((id) => FONTS_BY_ID[id])
    .filter(Boolean);
  if (!alts.length) return null;
  return (
    <div className="mt-8 border border-border bg-card p-5">
      <span className="label-eyebrow">Free alternatives</span>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Free alternatives with a similar functional role or visual direction.
        They do not reproduce the exact tone or proportions of {font.name}.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {alts.map((a) => (
          <a
            key={a.id}
            href={`/?q=${encodeURIComponent(a.name)}`}
            className="border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:border-foreground"
            style={{ fontFamily: a.family }}
          >
            {a.name}
          </a>
        ))}
      </div>
    </div>
  );
}