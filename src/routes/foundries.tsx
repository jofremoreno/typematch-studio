import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Header } from "@/components/typematch/header";
import { FONTS, SOURCES } from "@/data/fonts";
import { ArrowRight, ExternalLink } from "lucide-react";

export function foundrySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const Route = createFileRoute("/foundries")({
  head: () => ({
    meta: [
      { title: "Foundries — TypeMatch Studio" },
      { name: "description", content: "Browse every foundry, library and directory referenced in TypeMatch Studio." },
      { property: "og:title", content: "Foundries — TypeMatch Studio" },
      { property: "og:description", content: "Every foundry, library and directory available in TypeMatch Studio." },
    ],
  }),
  component: FoundriesPage,
});

const CATEGORY_LABEL: Record<string, string> = {
  free: "Open source / Free",
  premium: "Commercial",
  directory: "Directory",
  subscription: "Subscription",
};

function FoundriesPage() {
  const foundries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of FONTS) {
      counts.set(f.sourceName, (counts.get(f.sourceName) ?? 0) + 1);
    }
    return SOURCES.map((s) => ({
      ...s,
      slug: foundrySlug(s.name),
      familyCount: counts.get(s.name) ?? 0,
    })).sort((a, b) => b.familyCount - a.familyCount || a.name.localeCompare(b.name));
  }, []);

  const totals = useMemo(() => {
    return {
      foundries: foundries.length,
      families: FONTS.length,
      openSource: FONTS.filter((f) => f.availability === "open-source" || f.availability === "free").length,
    };
  }, [foundries.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-6 pb-32 sm:px-9">
        <section className="pb-10 pt-16 sm:pb-14 sm:pt-20">
          <span className="label-eyebrow">Foundry directory</span>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.25rem,5.5vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em]">
            Every foundry in TypeMatch Studio.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Foundries, open-source libraries and curated directories referenced
            across the catalogue. Filter the Library by source, or open any
            foundry below to see all the families it publishes.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-5 text-sm sm:grid-cols-4">
            <Stat label="Foundries" value={String(totals.foundries)} />
            <Stat label="Families" value={String(totals.families)} />
            <Stat label="Open source / Free" value={String(totals.openSource)} />
            <Stat label="Curated directories" value={String(foundries.filter((f) => f.category === "directory").length)} />
          </dl>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {foundries.map((f) => (
            <article
              key={f.name}
              className="editorial-card safe-card flex flex-col gap-4"
            >
              <header className="ui-text flex flex-col gap-0.5">
                <span className="label-eyebrow">{CATEGORY_LABEL[f.category] ?? f.category}</span>
                <span className="label-eyebrow text-muted-foreground">{f.type}</span>
              </header>
              <h2 className="font-editorial text-2xl leading-tight tracking-tight">
                {f.name}
              </h2>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {f.notes}
              </p>
              <dl className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-[11px]">
                <div>
                  <dt className="label-eyebrow">Families</dt>
                  <dd className="font-mono-ui mt-0.5 text-sm tabular-nums text-foreground">
                    {f.familyCount}
                  </dd>
                </div>
                <div>
                  <dt className="label-eyebrow">License</dt>
                  <dd className="mt-0.5 text-[12px] text-foreground">{f.licenseConfidence}</dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-col gap-2">
                <Link
                  to="/foundries/$slug"
                  params={{ slug: f.slug }}
                  className="btn-card-primary w-full"
                >
                  View foundry
                  <ArrowRight size={14} />
                </Link>
                <a
                  href={f.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-card-secondary w-full justify-center"
                >
                  Official site
                  <ExternalLink size={12} />
                </a>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-eyebrow">{label}</dt>
      <dd className="font-mono-ui mt-1 text-2xl tabular-nums">{value}</dd>
    </div>
  );
}