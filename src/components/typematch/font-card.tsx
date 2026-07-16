import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Plus } from "lucide-react";
import type { FontRecord } from "@/data/fonts";
import { LicenseBadges } from "./license-badges";
import { useCompareQueue, COMPARE_MAX } from "@/lib/compare-queue";

/**
 * Shared font card. Editorial hierarchy: meta eyebrow → font name →
 * classification → dominant Aa preview → badges → CTA row.
 */
export function FontCard({ font }: { font: FontRecord }) {
  const { has, toggle, count } = useCompareQueue();
  const inQueue = has(font.id);
  const canAdd = inQueue || count < COMPARE_MAX;

  const previewFamily =
    font.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : font.family;

  return (
    <article className="tm-card group flex min-w-0 flex-col">
      {/* 01 Meta */}
      <div className="ui-text flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className="text-foreground/80">{font.classification}</span>
        <span aria-hidden>·</span>
        <span className="truncate">{font.sourceName}</span>
      </div>

      {/* 02 Font name */}
      <h3
        className="ui-text mt-2 truncate text-[15px] font-semibold tracking-[-0.01em]"
        title={font.name}
      >
        {font.name}
      </h3>

      {/* 03 Classification */}
      <p className="ui-text text-[11.5px] text-muted-foreground">
        {font.subclassification || font.classification}
      </p>

      {/* 04 Preview — dominant */}
      <div className="relative mt-4 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-[var(--surface-mid)] px-4 py-8">
        <span
          aria-hidden
          className="select-none text-[clamp(4.5rem,9vw,7.5rem)] font-normal leading-none tracking-[-0.04em] text-foreground"
          style={{ fontFamily: previewFamily }}
        >
          Aa
        </span>
      </div>

      {/* 05 Badges */}
      <div className="ui-text mt-4">
        <LicenseBadges font={font} compact />
      </div>

      {/* 06 CTA row */}
      <div className="ui-text mt-4 flex items-center gap-2">
        <Link
          to="/"
          search={{ q: font.name } as never}
          className="tm-btn-analyze flex-1"
        >
          Analyze
          <ArrowRight size={13} />
        </Link>
        <button
          type="button"
          onClick={() => canAdd && toggle(font)}
          disabled={!canAdd}
          aria-pressed={inQueue}
          aria-label={inQueue ? "Remove from compare" : "Add to compare"}
          className={
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors " +
            (inQueue
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40")
          }
        >
          {inQueue ? <Check size={14} /> : <Plus size={14} />}
        </button>
      </div>
    </article>
  );
}

/** Compact horizontal variant for List view. Same data, different layout. */
export function FontRow({ font }: { font: FontRecord }) {
  const { has, toggle, count } = useCompareQueue();
  const inQueue = has(font.id);
  const canAdd = inQueue || count < COMPARE_MAX;
  const previewFamily =
    font.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : font.family;

  return (
    <article className="tm-card flex items-center gap-4 !p-4">
      <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-[var(--surface-mid)]">
        <span
          aria-hidden
          className="select-none text-[2.5rem] leading-none tracking-[-0.04em]"
          style={{ fontFamily: previewFamily }}
        >
          Aa
        </span>
      </div>
      <div className="ui-text min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-foreground/80">{font.classification}</span>
          <span aria-hidden>·</span>
          <span className="truncate">{font.sourceName}</span>
        </div>
        <h3 className="mt-1 truncate text-[15px] font-semibold tracking-[-0.01em]" title={font.name}>
          {font.name}
        </h3>
        <p className="text-[11.5px] text-muted-foreground">{font.subclassification || font.classification}</p>
      </div>
      <div className="hidden md:block">
        <LicenseBadges font={font} compact />
      </div>
      <Link
        to="/"
        search={{ q: font.name } as never}
        className="tm-btn-analyze"
      >
        Analyze
        <ArrowRight size={13} />
      </Link>
      <button
        type="button"
        onClick={() => canAdd && toggle(font)}
        disabled={!canAdd}
        aria-pressed={inQueue}
        aria-label={inQueue ? "Remove from compare" : "Add to compare"}
        className={
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors " +
          (inQueue
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40")
        }
      >
        {inQueue ? <Check size={14} /> : <Plus size={14} />}
      </button>
    </article>
  );
}