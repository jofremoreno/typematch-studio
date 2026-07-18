import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo } from "react";
import { Header } from "@/components/typematch/header";
import { FONTS, SOURCES } from "@/data/fonts";
import { FontCard } from "@/components/typematch/font-card";
import { CompareChip } from "@/components/typematch/compare-chip";
import { foundrySlug } from "@/lib/foundries";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AnimatedNumber } from "@/components/typematch/animated-number";

export const Route = createFileRoute("/foundries/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Foundry — TypeMatch Studio` },
      {
        name: "description",
        content: "Foundry details and every family available in TypeMatch Studio.",
      },
    ],
  }),
  component: FoundryDetail,
  notFoundComponent: FoundryNotFound,
});

function FoundryDetail() {
  const { slug } = Route.useParams();
  const source = useMemo(() => SOURCES.find((s) => foundrySlug(s.name) === slug), [slug]);
  if (!source) throw notFound();

  const families = useMemo(() => FONTS.filter((f) => f.sourceName === source.name), [source.name]);

  const stats = useMemo(() => {
    const count = (pred: (f: (typeof FONTS)[number]) => boolean) => families.filter(pred).length;
    return {
      families: families.length,
      openSource: count((f) => f.availability === "open-source"),
      free: count((f) => f.availability === "free"),
      commercial: count((f) => f.availability === "paid" || f.availability === "subscription"),
    };
  }, [families]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-[1920px] px-5 pb-32 sm:px-8 lg:px-[5.75vw]">
        <header className="tm-page-header">
          <Link
            to="/catalogue"
            search={{ view: "sources" }}
            className="ui-text inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={12} />
            All catalogue sources
          </Link>
          <span className="label-eyebrow mt-6 block">{source.type}</span>
          <h1>{source.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {source.notes}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={source.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-card-primary"
            >
              Official site
              <ExternalLink size={12} />
            </a>
            <CompareChip />
          </div>

          <dl className="tm-stat-grid mt-10">
            <Stat label="Families" value={stats.families} />
            <Stat label="Open source" value={stats.openSource} />
            <Stat label="Free" value={stats.free} />
            <Stat label="Commercial" value={stats.commercial} />
          </dl>
        </header>

        <section className="tm-page-panel tm-source-families">
          <div className="tm-section-heading">
            <div>
              <span className="label-eyebrow">Typography</span>
              <h2 className="mt-3">Families in the catalogue.</h2>
            </div>
            <p>
              {families.length} {families.length === 1 ? "family is" : "families are"} currently
              represented from {source.name}.
            </p>
          </div>
          {families.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-sm text-muted-foreground">
              This foundry is listed as a reference — no families from it are yet included in the
              TypeMatch catalogue. Visit the official site to browse their type.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {families.map((f) => (
                <FontCard key={f.id} font={f} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="label-eyebrow">{label}</dt>
      <dd className="font-mono-ui mt-1 text-2xl tabular-nums">
        <AnimatedNumber value={value} />
      </dd>
    </div>
  );
}

function FoundryNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-9">
        <span className="label-eyebrow">Not found</span>
        <h1 className="font-editorial mt-3 text-4xl tracking-tight">This foundry isn't listed.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The foundry directory only lists sources referenced in the TypeMatch catalogue.
        </p>
        <Link
          to="/catalogue"
          search={{ view: "sources" }}
          className="btn-card-primary mt-8 inline-flex"
        >
          Back to catalogue sources
        </Link>
      </main>
    </div>
  );
}
