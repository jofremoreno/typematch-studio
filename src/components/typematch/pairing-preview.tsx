import { useState } from "react";
import { buildRecommendations } from "@/lib/pairing";
import type { FontRecord } from "@/data/fonts";
import { Badge } from "./badge";
import { useFontPreview } from "@/hooks/use-font-preview";

type PreviewKind = "Editorial poster" | "Website hero" | "Brand system" | "UI card";

const KINDS: PreviewKind[] = ["Editorial poster", "Website hero", "Brand system", "UI card"];

export function PairingPreview({ font }: { font: FontRecord }) {
  const pairings = buildRecommendations(font);
  const [kind, setKind] = useState<PreviewKind>("Editorial poster");
  const [idx, setIdx] = useState(0);
  const pair = pairings[idx];
  const primaryPreview = useFontPreview(pair.primary);
  const secondaryPreview = useFontPreview(pair.secondary);
  const primary = primaryPreview.family;
  const secondary = secondaryPreview.family;

  return (
    <section className="tm-analysis-card tm-context-section">
      <div className="tm-section-heading">
        <div>
          <span className="label-eyebrow">04 — Pairing in context</span>
          <h2 className="mt-3">Applied to real contexts.</h2>
        </div>
        <p>
          Test the recommended combinations in four practical layouts. Change the pairing or the
          context without leaving the page.
        </p>
      </div>

      <div className="tm-context-toolbar">
        <div className="tm-context-control-group" aria-label="Pairing direction">
          <span className="label-eyebrow">Pairing</span>
          <div>
            {pairings.map((p, i) => (
              <button type="button" key={p.name} onClick={() => setIdx(i)} aria-pressed={i === idx}>
                {i + 1}. {p.category.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="tm-context-control-group" aria-label="Preview context">
          <span className="label-eyebrow">Context</span>
          <div>
            {KINDS.map((k) => (
              <button type="button" key={k} onClick={() => setKind(k)} aria-pressed={k === kind}>
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tm-context-canvas">
        {kind === "Editorial poster" && (
          <EditorialPoster
            primary={primary}
            secondary={secondary}
            primaryName={pair.primary.name}
            secondaryName={pair.secondary.name}
          />
        )}
        {kind === "Website hero" && <WebsiteHero primary={primary} secondary={secondary} />}
        {kind === "Brand system" && (
          <BrandSystem primary={primary} secondary={secondary} primaryName={pair.primary.name} />
        )}
        {kind === "UI card" && <UICard primary={primary} secondary={secondary} />}
      </div>

      <div className="tm-context-caption">
        <span className="font-mono-ui">0{idx + 1}</span>
        <p>
          <strong>{pair.name}</strong>
          <span>
            {pair.primaryRole} / {pair.secondaryRole}
          </span>
        </p>
      </div>
    </section>
  );
}

function EditorialPoster({
  primary,
  secondary,
  primaryName,
  secondaryName,
}: {
  primary: string;
  secondary: string;
  primaryName: string;
  secondaryName: string;
}) {
  return (
    <div className="tm-context-editorial">
      <div className="flex flex-col justify-between gap-10 p-10">
        <div className="flex items-baseline justify-between" style={{ fontFamily: secondary }}>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Issue Nº 04
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Spring</span>
        </div>
        <h3 className="tm-context-display-title" style={{ fontFamily: primary }}>
          On the quiet
          <br />
          architecture
          <br />
          of reading.
        </h3>
        <p className="max-w-md text-sm leading-relaxed" style={{ fontFamily: secondary }}>
          A study on how rhythm, x-height and optical contrast shape long-form reading on paper.
          With contributions from designers across publishing, identity and screen.
        </p>
      </div>
      <aside className="flex flex-col justify-between gap-6 border-t border-border bg-background p-8 md:border-l md:border-t-0">
        <span className="label-eyebrow">Colophon</span>
        <div className="space-y-3 text-sm" style={{ fontFamily: secondary }}>
          <p>
            Display set in <span style={{ fontFamily: primary }}>{primaryName}</span>.
          </p>
          <p>
            Text set in <span style={{ fontFamily: secondary }}>{secondaryName}</span>.
          </p>
        </div>
        <span className="font-mono-ui text-[11px] text-muted-foreground">032 / 144</span>
      </aside>
    </div>
  );
}

function WebsiteHero({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="tm-context-website">
      <div className="tm-context-website-nav" style={{ fontFamily: secondary }}>
        <span className="text-sm">— Studio Nord</span>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Work · Index · Contact
        </span>
      </div>
      <h3 className="tm-context-display-title mt-12" style={{ fontFamily: primary }}>
        Identity systems built on quiet, measured typography.
      </h3>
      <p
        className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"
        style={{ fontFamily: secondary }}
      >
        A small design practice working across editorial, cultural and independent product clients.
        Selected projects, 2017 — present.
      </p>
      <div className="tm-context-actions" style={{ fontFamily: secondary }}>
        <span className="rounded-lg bg-foreground px-4 py-2 text-sm text-background">
          See selected work
        </span>
        <span className="rounded-lg border border-border px-4 py-2 text-sm">About the studio</span>
      </div>
    </div>
  );
}

function BrandSystem({
  primary,
  secondary,
  primaryName,
}: {
  primary: string;
  secondary: string;
  primaryName: string;
}) {
  return (
    <div className="tm-context-brand-grid">
      {[
        { label: "Mark", body: "Atelier" },
        { label: "Voice", body: "Slow press, careful materials." },
        { label: "Index", body: "01 — 24" },
      ].map((c, i) => (
        <div
          key={c.label}
          className={
            "flex min-h-[200px] flex-col justify-between p-8 " +
            (i < 2 ? "border-b border-border md:border-b-0 md:border-r" : "")
          }
        >
          <span className="label-eyebrow">{c.label}</span>
          <p className="text-3xl tracking-tight" style={{ fontFamily: primary }}>
            {c.body}
          </p>
          <span className="text-xs text-muted-foreground" style={{ fontFamily: secondary }}>
            Set in {primaryName}.
          </span>
        </div>
      ))}
    </div>
  );
}

function UICard({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="tm-context-ui-grid">
      <div className="space-y-4 p-8" style={{ fontFamily: secondary }}>
        <Badge variant="outline">Account · billing</Badge>
        <h4 className="text-2xl tracking-tight" style={{ fontFamily: primary }}>
          Studio plan
        </h4>
        <p className="text-sm text-muted-foreground">
          Renews on the 24th. You're using 18 of 25 seats. Update payment method or invite teammates
          from the workspace settings.
        </p>
        <div className="flex gap-2 pt-2">
          <span className="rounded-lg bg-foreground px-3 py-2 text-xs text-background">
            Manage seats
          </span>
          <span className="rounded-lg border border-border px-3 py-2 text-xs">View invoice</span>
        </div>
      </div>
      <div
        className="space-y-3 border-t border-border bg-background p-8 md:border-l md:border-t-0"
        style={{ fontFamily: secondary }}
      >
        {[
          ["Plan", "Studio · annual"],
          ["Renewal", "24 May 2026"],
          ["Seats", "18 / 25"],
          ["Owner", "atelier@studio.no"],
        ].map(([k, v]) => (
          <div key={k} className="tm-context-data-row">
            <span className="label-eyebrow">{k}</span>
            <span className="text-foreground">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
