import { useState } from "react";
import { buildRecommendations } from "@/lib/pairing";
import type { FontRecord } from "@/data/fonts";
import { Badge } from "./badge";

type PreviewKind = "Editorial poster" | "Website hero" | "Brand system" | "UI card";

const KINDS: PreviewKind[] = ["Editorial poster", "Website hero", "Brand system", "UI card"];

export function PairingPreview({ font }: { font: FontRecord }) {
  const pairings = buildRecommendations(font);
  const [kind, setKind] = useState<PreviewKind>("Editorial poster");
  const [idx, setIdx] = useState(0);
  const pair = pairings[idx];
  const primary = pair.primary.family;
  const secondary = pair.secondary.family;

  return (
    <section className="border-b border-border py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="label-eyebrow">08 — Pairing preview</span>
          <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
            Applied to real contexts.
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1 border border-border bg-card p-1 text-xs">
          {pairings.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setIdx(i)}
              className={
                "px-3 py-1.5 transition-colors " +
                (i === idx
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {i + 1}. {p.category.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border pb-3 text-xs">
        {KINDS.map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={
              "border px-3 py-1.5 transition-colors " +
              (k === kind
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:text-foreground")
            }
          >
            {k}
          </button>
        ))}
      </div>

      <div className="mt-5 border border-border bg-card">
        {kind === "Editorial poster" && (
          <EditorialPoster primary={primary} secondary={secondary} primaryName={pair.primary.name} secondaryName={pair.secondary.name} />
        )}
        {kind === "Website hero" && (
          <WebsiteHero primary={primary} secondary={secondary} />
        )}
        {kind === "Brand system" && (
          <BrandSystem primary={primary} secondary={secondary} primaryName={pair.primary.name} />
        )}
        {kind === "UI card" && (
          <UICard primary={primary} secondary={secondary} />
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Preview {idx + 1} — {pair.name}. Roles: {pair.primaryRole.toLowerCase()} / {pair.secondaryRole.toLowerCase()}.
      </p>
    </section>
  );
}

function EditorialPoster({ primary, secondary, primaryName, secondaryName }: { primary: string; secondary: string; primaryName: string; secondaryName: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px]">
      <div className="flex flex-col justify-between gap-10 p-10">
        <div className="flex items-baseline justify-between" style={{ fontFamily: secondary }}>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Issue Nº 04</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Spring</span>
        </div>
        <h3
          className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight"
          style={{ fontFamily: primary }}
        >
          On the quiet
          <br />
          architecture
          <br />
          of reading.
        </h3>
        <p className="max-w-md text-sm leading-relaxed" style={{ fontFamily: secondary }}>
          A study on how rhythm, x-height and optical contrast shape long-form
          reading on paper. With contributions from designers across
          publishing, identity and screen.
        </p>
      </div>
      <aside className="flex flex-col justify-between gap-6 border-t border-border bg-background p-8 md:border-l md:border-t-0">
        <span className="label-eyebrow">Colophon</span>
        <div className="space-y-3 text-sm" style={{ fontFamily: secondary }}>
          <p>Display set in <span style={{ fontFamily: primary }}>{primaryName}</span>.</p>
          <p>Text set in <span style={{ fontFamily: secondary }}>{secondaryName}</span>.</p>
        </div>
        <span className="font-mono-ui text-[11px] text-muted-foreground">032 / 144</span>
      </aside>
    </div>
  );
}

function WebsiteHero({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="p-10">
      <div className="flex items-center justify-between border-b border-border pb-5" style={{ fontFamily: secondary }}>
        <span className="text-sm">— Studio Nord</span>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Work · Index · Contact</span>
      </div>
      <h3
        className="mt-12 text-[clamp(2rem,6vw,4.5rem)] leading-[1.02] tracking-tight"
        style={{ fontFamily: primary }}
      >
        Identity systems built on quiet, measured typography.
      </h3>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground" style={{ fontFamily: secondary }}>
        A small design practice working across editorial, cultural and
        independent product clients. Selected projects, 2017 — present.
      </p>
      <div className="mt-8 flex items-center gap-3" style={{ fontFamily: secondary }}>
        <button className="bg-foreground px-4 py-2 text-sm text-background">See selected work</button>
        <button className="border border-border px-4 py-2 text-sm">About the studio</button>
      </div>
    </div>
  );
}

function BrandSystem({ primary, secondary, primaryName }: { primary: string; secondary: string; primaryName: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      {[
        { label: "Mark", body: "Atelier" },
        { label: "Voice", body: "Slow press, careful materials." },
        { label: "Index", body: "01 — 24" },
      ].map((c, i) => (
        <div key={c.label} className={"flex min-h-[200px] flex-col justify-between p-8 " + (i < 2 ? "border-b border-border md:border-b-0 md:border-r" : "")}>
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
    <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
      <div className="space-y-4 p-8" style={{ fontFamily: secondary }}>
        <Badge variant="outline">Account · billing</Badge>
        <h4 className="text-2xl tracking-tight" style={{ fontFamily: primary }}>
          Studio plan
        </h4>
        <p className="text-sm text-muted-foreground">
          Renews on the 24th. You're using 18 of 25 seats. Update payment
          method or invite teammates from the workspace settings.
        </p>
        <div className="flex gap-2 pt-2">
          <button className="bg-foreground px-3 py-2 text-xs text-background">Manage seats</button>
          <button className="border border-border px-3 py-2 text-xs">View invoice</button>
        </div>
      </div>
      <div className="space-y-3 border-t border-border bg-background p-8 md:border-l md:border-t-0" style={{ fontFamily: secondary }}>
        {[
          ["Plan", "Studio · annual"],
          ["Renewal", "24 May 2026"],
          ["Seats", "18 / 25"],
          ["Owner", "atelier@studio.no"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between border-b border-border py-2 text-sm">
            <span className="label-eyebrow">{k}</span>
            <span className="text-foreground">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}