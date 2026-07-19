import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpenText, Check, Plus } from "lucide-react";
import { useState } from "react";
import type { FontRecord } from "@/data/fonts";
import { useFontPreview } from "@/hooks/use-font-preview";
import { LicenseBadges } from "./license-badges";
import { useCompareQueue, COMPARE_MAX } from "@/lib/compare-queue";

const PANGRAMS = [
  "The five boxing wizards jump quickly.",
  "Pack my box with five dozen liquor jugs.",
  "Sphinx of black quartz, judge my vow.",
  "Amazingly few discotheques provide jukeboxes.",
  "Bright vixens jump; dozy fowl quack.",
  "Waltz, bad nymph, for quick jigs vex.",
  "Quick zephyrs blow, vexing daft Jim.",
  "Jaded zombies acted quietly but kept driving.",
] as const;

function stablePhraseIndex(id: string) {
  return [...id].reduce((total, character) => total + character.charCodeAt(0), 0) % PANGRAMS.length;
}

export interface SpecimenSettings {
  text: string;
  size: number;
  weight: number;
  lineHeight: number;
  uppercase: boolean;
}

const DEFAULT_SPECIMEN: SpecimenSettings = {
  text: "",
  size: 132,
  weight: 400,
  lineHeight: 0.95,
  uppercase: false,
};

/**
 * Shared font card. Editorial hierarchy: meta eyebrow → font name →
 * classification → dominant Aa preview → badges → CTA row.
 */
export function FontCard({
  font,
  index = 0,
  specimen = DEFAULT_SPECIMEN,
}: {
  font: FontRecord;
  index?: number;
  specimen?: SpecimenSettings;
}) {
  const { has, toggle, count } = useCompareQueue();
  const inQueue = has(font.id);
  const canAdd = inQueue || count < COMPARE_MAX;
  const preview = useFontPreview(font);
  const requiresLicensedWebfont =
    font.licenseStatus === "license-required" ||
    font.availability === "paid" ||
    font.availability === "subscription";
  const [phraseIndex, setPhraseIndex] = useState(() => stablePhraseIndex(font.id));
  const customText = specimen.text.trim();
  const specimenStyle = {
    fontFamily: preview.family,
    fontSize: `${specimen.size}px`,
    fontWeight: specimen.weight,
    lineHeight: specimen.lineHeight,
    textTransform: specimen.uppercase ? ("uppercase" as const) : ("none" as const),
  };

  const rotatePhrase = () => {
    setPhraseIndex((current) => {
      if (PANGRAMS.length < 2) return current;
      const offset = 1 + Math.floor(Math.random() * (PANGRAMS.length - 1));
      return (current + offset) % PANGRAMS.length;
    });
  };

  return (
    <article
      className="tm-card tm-font-card group relative flex min-w-0 flex-col"
      data-custom-specimen={customText ? "true" : undefined}
      style={{ animationDelay: `${Math.min(index % 8, 7) * 35}ms` }}
      onMouseEnter={rotatePhrase}
      onFocusCapture={rotatePhrase}
    >
      <Link
        to="/analyze"
        search={{ font: font.id } as never}
        className="absolute inset-0 z-10 rounded-[inherit]"
        aria-label={`Analyze ${font.name}`}
      />

      {/* 01 Meta */}
      <div className="ui-text flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className="text-foreground/80">{font.classification}</span>
        <span aria-hidden>·</span>
        <span className="truncate">{font.sourceName}</span>
        {preview.status === "unavailable" && (
          <span className="ml-auto shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[11px] tracking-[0.12em]">
            {requiresLicensedWebfont ? "Licensed" : "Reference"}
          </span>
        )}
      </div>

      {/* 02 Font name */}
      <h3
        className="ui-text mt-2 truncate text-[15px] font-semibold tracking-[-0.01em]"
        title={font.name}
      >
        {font.name}
      </h3>

      {/* 03 Classification */}
      <p className="ui-text text-xs text-muted-foreground">
        {font.subclassification || font.classification}
      </p>

      {/* 04 Specimen — the card itself is the canvas; no nested grey box. */}
      <div
        className="tm-font-specimen relative mt-4 flex flex-1 overflow-hidden"
        aria-label={`${font.name} typeface preview`}
      >
        {preview.status === "loading" ? (
          <div className="tm-font-loading ui-text" aria-hidden>
            <span />
          </div>
        ) : preview.status === "unavailable" ? (
          <div className="tm-font-reference ui-text">
            <BookOpenText size={20} strokeWidth={1.5} aria-hidden />
            <span>
              {requiresLicensedWebfont ? "Licensed webfont required" : "Catalogue reference"}
            </span>
          </div>
        ) : (
          <>
            <span
              aria-hidden
              className="tm-font-aa select-none text-foreground"
              style={specimenStyle}
            >
              {customText || "Aa"}
            </span>
            <p
              className="tm-font-pangram select-none text-foreground"
              style={{ ...specimenStyle, fontSize: customText ? `${specimen.size}px` : undefined }}
            >
              {customText || PANGRAMS[phraseIndex]}
            </p>
          </>
        )}
      </div>

      {/* 05 Badges */}
      <div className="ui-text mt-4">
        <LicenseBadges font={font} compact />
      </div>

      {/* 06 CTA row */}
      <div className="ui-text pointer-events-none relative z-20 mt-4 flex items-center gap-2">
        <Link
          to="/analyze"
          search={{ font: font.id } as never}
          className="tm-btn-analyze pointer-events-auto flex-1"
        >
          Analyze
          <ArrowRight size={12} />
        </Link>
        <button
          type="button"
          onClick={() => canAdd && toggle(font)}
          disabled={!canAdd}
          aria-pressed={inQueue}
          aria-label={inQueue ? "Remove from compare" : "Add to compare"}
          className={
            "pointer-events-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors " +
            (inQueue
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40")
          }
        >
          {inQueue ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>
    </article>
  );
}

/** Compact horizontal variant for List view. Same data, different layout. */
export function FontRow({
  font,
  specimen = DEFAULT_SPECIMEN,
}: {
  font: FontRecord;
  specimen?: SpecimenSettings;
}) {
  const { has, toggle, count } = useCompareQueue();
  const inQueue = has(font.id);
  const canAdd = inQueue || count < COMPARE_MAX;
  const preview = useFontPreview(font);
  const rowText = specimen.text.trim() || "Aa";

  return (
    <article className="tm-card relative flex items-center gap-4 !p-4">
      <Link
        to="/analyze"
        search={{ font: font.id } as never}
        className="absolute inset-0 z-10 rounded-[inherit]"
        aria-label={`Analyze ${font.name}`}
      />
      <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-[var(--surface-mid)]">
        {preview.status === "loading" ? (
          <span className="tm-row-font-loading ui-text" aria-hidden>
            Aa
          </span>
        ) : preview.status === "unavailable" ? (
          <BookOpenText size={16} strokeWidth={1.5} className="text-muted-foreground" aria-hidden />
        ) : (
          <span
            aria-hidden
            className="max-w-full select-none truncate px-2 leading-none tracking-[-0.04em]"
            style={{
              fontFamily: preview.family,
              fontSize: `${Math.min(specimen.size, 40)}px`,
              fontWeight: specimen.weight,
              textTransform: specimen.uppercase ? "uppercase" : "none",
            }}
          >
            {rowText}
          </span>
        )}
      </div>
      <div className="ui-text min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-foreground/80">{font.classification}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{font.sourceName}</span>
        </div>
        <h3
          className="mt-1 truncate text-[15px] font-semibold tracking-[-0.01em]"
          title={font.name}
        >
          {font.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {font.subclassification || font.classification}
        </p>
      </div>
      <div className="hidden md:block">
        <LicenseBadges font={font} compact />
      </div>
      <Link
        to="/analyze"
        search={{ font: font.id } as never}
        className="tm-btn-analyze pointer-events-auto relative z-20"
      >
        Analyze
        <ArrowRight size={12} />
      </Link>
      <button
        type="button"
        onClick={() => canAdd && toggle(font)}
        disabled={!canAdd}
        aria-pressed={inQueue}
        aria-label={inQueue ? "Remove from compare" : "Add to compare"}
        className={
          "relative z-20 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors " +
          (inQueue
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40")
        }
      >
        {inQueue ? <Check size={16} /> : <Plus size={16} />}
      </button>
    </article>
  );
}
