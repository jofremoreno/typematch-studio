import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpenText, Check, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FontRecord } from "@/data/fonts";
import { LicenseBadges } from "./license-badges";
import { useCompareQueue, COMPARE_MAX } from "@/lib/compare-queue";

const FALLBACK_FAMILY = "Inter, ui-sans-serif, system-ui, sans-serif";

const STATIC_PREVIEW_SOURCES = new Set([
  "Fontshare",
  "Official repository",
  "Collletttivo",
  "Velvetyne",
  "The League of Moveable Type",
  "Font Squirrel",
]);

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

function primaryFamily(font: FontRecord) {
  return font.family.split(",")[0]?.replace(/["']/g, "").trim() || font.name;
}

function stablePhraseIndex(id: string) {
  return [...id].reduce((total, character) => total + character.charCodeAt(0), 0) % PANGRAMS.length;
}

type PreviewStatus = "loading" | "ready" | "unavailable";

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

function googleStylesheetUrl(family: string) {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}&display=swap`;
}

function fontsourceStylesheetUrl(font: FontRecord) {
  return `https://cdn.jsdelivr.net/fontsource/css/${encodeURIComponent(font.id)}@latest/index.min.css`;
}

function previewStylesheetUrls(font: FontRecord, family: string) {
  if (font.canPreviewInApp === false) return [];

  // These families already have same-origin @font-face declarations in the
  // app styles. Loading the Fontshare API as a cross-origin stylesheet caused
  // Chrome to expose the sheet without reliably registering its font faces.
  if (STATIC_PREVIEW_SOURCES.has(font.sourceName)) return [];

  if (font.sourceName === "Google Fonts") {
    return [googleStylesheetUrl(family), fontsourceStylesheetUrl(font)];
  }

  // The open-source foundries in the catalogue do not expose one common CSS
  // endpoint. Fontsource covers many of them; several League and Font Squirrel
  // families are also mirrored by Google Fonts.
  return [fontsourceStylesheetUrl(font), googleStylesheetUrl(family)];
}

/**
 * Only promise an authentic specimen when the actual webfont can be loaded.
 * Google Fonts entries are loaded lazily; catalogue-only references use an
 * explicit UI fallback instead of silently impersonating the typeface.
 */
function useVerifiedPreview(font: FontRecord) {
  const family = primaryFamily(font);
  const stylesheetUrls = useMemo(() => previewStylesheetUrls(font, family), [family, font]);
  const [status, setStatus] = useState<PreviewStatus>(() =>
    font.canPreviewInApp === false ? "unavailable" : "loading",
  );

  useEffect(() => {
    let cancelled = false;
    setStatus(font.canPreviewInApp === false ? "unavailable" : "loading");
    if (font.canPreviewInApp === false) return;

    const safeId = font.id.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const verifyFamily = async () => {
      try {
        const faces = await document.fonts.load(`400 48px "${family}"`);
        return faces.length > 0;
      } catch {
        return false;
      }
    };

    const loadStylesheet = (url: string, index: number) =>
      new Promise<boolean>((resolve) => {
        const linkId = `font-preview-${safeId}-${index}`;
        let link = document.getElementById(linkId) as HTMLLinkElement | null;
        let finished = false;
        let timeout = 0;

        const finish = (loaded: boolean) => {
          if (finished) return;
          finished = true;
          window.clearTimeout(timeout);
          link?.removeEventListener("load", onLoad);
          link?.removeEventListener("error", onError);
          resolve(loaded);
        };
        const onLoad = () => {
          if (link) link.dataset.previewState = "ready";
          finish(true);
        };
        const onError = () => {
          if (link) link.dataset.previewState = "unavailable";
          finish(false);
        };

        if (!link) {
          link = document.createElement("link");
          link.id = linkId;
          link.rel = "stylesheet";
          link.href = url;
          link.addEventListener("load", onLoad);
          link.addEventListener("error", onError);
          document.head.appendChild(link);
        } else if (link.dataset.previewState === "ready" || link.sheet) {
          finish(true);
          return;
        } else if (link.dataset.previewState === "unavailable") {
          finish(false);
          return;
        } else {
          link.addEventListener("load", onLoad);
          link.addEventListener("error", onError);
        }

        timeout = window.setTimeout(() => finish(false), 6000);
      });

    const loadPreview = async () => {
      if (await verifyFamily()) {
        if (!cancelled) setStatus("ready");
        return;
      }

      for (const [index, url] of stylesheetUrls.entries()) {
        const stylesheetLoaded = await loadStylesheet(url, index);
        if (cancelled) return;
        if (stylesheetLoaded && (await verifyFamily())) {
          if (!cancelled) setStatus("ready");
          return;
        }
      }

      if (!cancelled) setStatus("unavailable");
    };

    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [family, font.canPreviewInApp, font.id, stylesheetUrls]);

  return {
    family: status === "unavailable" ? FALLBACK_FAMILY : font.family,
    status,
  };
}

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
  const preview = useVerifiedPreview(font);
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
      className="tm-card tm-font-card group flex min-w-0 flex-col"
      data-custom-specimen={customText ? "true" : undefined}
      style={{ animationDelay: `${Math.min(index % 8, 7) * 35}ms` }}
      onMouseEnter={rotatePhrase}
      onFocusCapture={rotatePhrase}
    >
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
            <span>Aa</span>
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
      <div className="ui-text mt-4 flex items-center gap-2">
        <Link to="/analyze" search={{ font: font.id } as never} className="tm-btn-analyze flex-1">
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
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors " +
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
  const preview = useVerifiedPreview(font);
  const rowText = specimen.text.trim() || "Aa";

  return (
    <article className="tm-card flex items-center gap-4 !p-4">
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
      <Link to="/analyze" search={{ font: font.id } as never} className="tm-btn-analyze">
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
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors " +
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
