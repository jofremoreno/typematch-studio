import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Plus } from "lucide-react";
import type { FontRecord } from "@/data/fonts";
import { isPremiumReference } from "@/data/fonts";
import { LicenseBadges } from "./license-badges";
import { useCompareQueue, COMPARE_MAX } from "@/lib/compare-queue";

/**
 * Shared font card used by the Library and Foundry detail. Includes the
 * Analyze primary action and a Compare quick action (secondary).
 */
export function FontCard({ font }: { font: FontRecord }) {
  const { has, toggle, count } = useCompareQueue();
  const inQueue = has(font.id);
  const canAdd = inQueue || count < COMPARE_MAX;

  const previewFamily =
    font.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : font.family;

  return (
    <article className="editorial-card safe-card group flex aspect-square min-w-0 flex-col gap-3">
      <header className="ui-text flex flex-col gap-0.5">
        <span className="label-eyebrow">{font.classification}</span>
        <span className="label-eyebrow text-muted-foreground">{font.sourceName}</span>
      </header>

      <p
        className="min-w-0 break-words text-[clamp(1.5rem,2.1vw,2.125rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
        style={{ fontFamily: previewFamily }}
        title={font.name}
      >
        {font.name}
      </p>

      <p
        className="text-lg leading-none text-muted-foreground"
        style={{ fontFamily: previewFamily }}
      >
        Aa Bb Cc 123
      </p>

      <div className="ui-text mt-auto space-y-3">
        <LicenseBadges font={font} compact />
        {isPremiumReference(font) && (
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Premium reference
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Link
            to="/"
            search={{ q: font.name } as never}
            className="btn-card-primary w-full"
          >
            Analyze
            <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            onClick={() => canAdd && toggle(font)}
            disabled={!canAdd}
            aria-pressed={inQueue}
            className={
              "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors " +
              (inQueue
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground")
            }
          >
            {inQueue ? <Check size={12} /> : <Plus size={12} />}
            {inQueue ? "Added" : "Compare"}
          </button>
        </div>
      </div>
    </article>
  );
}