import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Header } from "@/components/typematch/header";
import { FONTS, FONTS_BY_ID, isPremiumReference } from "@/data/fonts";
import { compareFonts } from "@/lib/pairing";
import { LicenseBadges } from "@/components/typematch/license-badges";

const searchSchema = z.object({
  a: z.string().optional(),
  b: z.string().optional(),
});

export const Route = createFileRoute("/compare")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Compare typefaces — TypeMatch Studio" },
      { name: "description", content: "Side-by-side comparison of two typefaces with role separation, risk and free alternatives." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { a: aId, b: bId } = Route.useSearch();
  const [a, setA] = useState<string>(aId ?? "inter");
  const [b, setB] = useState<string>(bId ?? "playfair-display");

  const fontA = FONTS_BY_ID[a] ?? FONTS[0];
  const fontB = FONTS_BY_ID[b] ?? FONTS[1];

  const result = useMemo(() => compareFonts(fontA, fontB), [fontA, fontB]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
        <span className="label-eyebrow">Compare</span>
        <h1 className="font-editorial mt-3 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-tight">
          Two typefaces, one informed decision.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Side-by-side comparison based on local attributes. Free alternatives
          are surfaced whenever a premium reference is involved.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Picker label="Font A" value={a} onChange={setA} />
          <Picker label="Font B" value={b} onChange={setB} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-0 border border-border bg-card sm:grid-cols-2">
          <PreviewBlock font={fontA} />
          <div className="border-t border-border sm:border-l sm:border-t-0">
            <PreviewBlock font={fontB} />
          </div>
        </div>

        <section className="mt-10 border border-border bg-card p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-editorial text-2xl tracking-tight">Can they work together?</h2>
            <span className="label-eyebrow">Verdict</span>
          </div>
          <p className="mt-3 text-xl text-foreground">{result.canWorkTogether}</p>
          <p className="mt-1 text-xs text-muted-foreground">Pairing risk — {result.riskLevel}</p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <span className="label-eyebrow">Recommended role separation</span>
              <p className="mt-2 text-sm text-foreground">{result.roleSeparation}</p>
            </div>
            <div>
              <span className="label-eyebrow">Why</span>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{result.why}</p>
            </div>
          </div>

          {result.licensingFlag && (
            <p className="mt-6 border-l-2 border-accent bg-background p-3 text-xs leading-relaxed text-muted-foreground">
              {result.licensingFlag}
            </p>
          )}

          {result.freeAlternatives.length > 0 && (
            <div className="mt-6 border-t border-border pt-5">
              <span className="label-eyebrow">Better free alternatives</span>
              <div className="mt-3 space-y-3">
                {result.freeAlternatives.map((g) => (
                  <div key={g.for.id} className="text-xs">
                    <p className="text-muted-foreground">
                      For <strong className="text-foreground">{g.for.name}</strong> (similar functional role, no commercial license required):
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {g.alternatives.map((alt) => (
                        <a
                          key={alt.id}
                          href={`/?q=${encodeURIComponent(alt.name)}`}
                          className="border border-border bg-background px-3 py-1.5 text-foreground hover:border-foreground"
                          style={{ fontFamily: alt.family }}
                        >
                          {alt.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-10 border border-border bg-card">
          <AttributeTable a={fontA} b={fontB} />
        </section>
      </main>
    </div>
  );
}

function Picker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-2 border border-border bg-card p-3">
      <span className="label-eyebrow">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm text-foreground outline-none"
      >
        {FONTS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name} {isPremiumReference(f) ? "— premium reference" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

function PreviewBlock({ font }: { font: (typeof FONTS)[number] }) {
  const family = font.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : font.family;
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">{font.classification}</span>
        <LicenseBadges font={font} compact />
      </div>
      <p className="text-5xl leading-none tracking-tight" style={{ fontFamily: family }}>
        {font.name}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: family }}>
        The quick brown fox jumps over the lazy dog.
      </p>
      <p className="text-xs text-muted-foreground">{font.foundry ?? font.sourceName}</p>
    </div>
  );
}

function AttributeTable({ a, b }: { a: (typeof FONTS)[number]; b: (typeof FONTS)[number] }) {
  const rows: { label: string; av: string | number; bv: string | number }[] = [
    { label: "Classification", av: a.classification, bv: b.classification },
    { label: "Subclassification", av: a.subclassification, bv: b.subclassification },
    { label: "Availability", av: a.availability ?? "—", bv: b.availability ?? "—" },
    { label: "License status", av: a.licenseStatus ?? "—", bv: b.licenseStatus ?? "—" },
    { label: "Foundry", av: a.foundry ?? "—", bv: b.foundry ?? "—" },
    { label: "Best roles", av: a.bestRoles.join(", "), bv: b.bestRoles.join(", ") },
    { label: "Weak roles", av: a.weakRoles.join(", "), bv: b.weakRoles.join(", ") },
    { label: "UI score", av: a.uiScore, bv: b.uiScore },
    { label: "Print score", av: a.printScore, bv: b.printScore },
    { label: "Screen score", av: a.screenScore, bv: b.screenScore },
    { label: "Body text score", av: a.bodyTextScore, bv: b.bodyTextScore },
    { label: "Display score", av: a.displayScore, bv: b.displayScore },
    { label: "Readability score", av: a.readabilityScore, bv: b.readabilityScore },
    { label: "Pairing difficulty", av: a.pairingDifficulty, bv: b.pairingDifficulty },
    { label: "Contrast tolerance", av: a.contrastTolerance, bv: b.contrastTolerance },
    { label: "Recommended", av: a.recommendedContexts.join(", "), bv: b.recommendedContexts.join(", ") },
    { label: "Avoid", av: a.avoidContexts.join(", "), bv: b.avoidContexts.join(", ") },
  ];
  return (
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="border-b border-border">
          <th className="label-eyebrow p-3 font-normal">Attribute</th>
          <th className="label-eyebrow p-3 font-normal">{a.name}</th>
          <th className="label-eyebrow p-3 font-normal">{b.name}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-b border-border last:border-b-0">
            <td className="p-3 text-muted-foreground">{r.label}</td>
            <td className="p-3 text-foreground">{r.av}</td>
            <td className="p-3 text-foreground">{r.bv}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}