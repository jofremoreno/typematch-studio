import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/typematch/header";
import { AnimatedNumber } from "@/components/typematch/animated-number";
import { CatalogueSources } from "@/components/typematch/catalogue-sources";
import { FontLibrary } from "@/components/typematch/font-library";
import { SavedPairings } from "@/components/typematch/saved-pairings";
import { PairingOfTheDay } from "@/components/typematch/pairing-of-the-day";
import { PUBLIC_FONTS, PUBLIC_SOURCES } from "@/data/fonts";
import { ArrowRight } from "lucide-react";

const searchSchema = z.object({
  view: z.enum(["typefaces", "sources"]).optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "TypeMatch Studio" },
      {
        name: "description",
        content:
          "Explore free typefaces, analyze them, and build pairings based on contrast, legibility and context.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { view = "typefaces" } = Route.useSearch();
  const free = PUBLIC_FONTS.filter(
    (font) => font.availability === "free" || font.availability === "open-source",
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-[1920px] px-5 pb-32 sm:px-8 lg:px-[5.75vw]">
        <section className="tm-home-hero tm-page-intro">
          <div className="tm-home-hero-copy">
            <span className="label-eyebrow">A typography tool, not a generator</span>
            <h1 className="tm-home-title">
              Typography pairing
              <br />
              with design logic.
            </h1>
            <p className="tm-home-description">
              Analyze typefaces, compare visual behaviour and build better combinations — browse the
              catalogue, filter by use and license, then dive into any specimen.
            </p>
            <div className="tm-home-actions">
              <Link to="/" hash="catalogue" className="tm-home-cta tm-arrow-link group">
                Explore the catalogue
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <PairingOfTheDay />
        </section>

        <section id="catalogue" className="scroll-mt-16 pt-10 sm:pt-16">
          <header className="tm-page-header">
            <span className="label-eyebrow">TypeMatch catalogue</span>
            <div className="mt-3 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(500px,0.66fr)] xl:items-end">
              <div>
                <h2>Typefaces and their sources, together.</h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  Explore the full collection, filter by use and availability, and open any family
                  to test its specimen and pairing behaviour.
                </p>
              </div>
              <dl className="tm-stat-grid">
                <Stat label="Families" value={PUBLIC_FONTS.length} />
                <Stat label="Sources" value={PUBLIC_SOURCES.length} />
                <Stat label="Open / Free" value={free} />
              </dl>
            </div>
          </header>

          <nav className="tm-catalogue-switcher" aria-label="Catalogue view">
            <Link
              to="/"
              hash="catalogue"
              search={{ view: "typefaces" }}
              className="tm-catalogue-switcher-link"
              data-active={view === "typefaces"}
              aria-current={view === "typefaces" ? "page" : undefined}
            >
              <span>01</span>
              Typefaces
              <strong>{PUBLIC_FONTS.length}</strong>
            </Link>
            <Link
              to="/"
              hash="catalogue"
              search={{ view: "sources" }}
              className="tm-catalogue-switcher-link"
              data-active={view === "sources"}
              aria-current={view === "sources" ? "page" : undefined}
            >
              <span>02</span>
              Sources
              <strong>{PUBLIC_SOURCES.length}</strong>
            </Link>
          </nav>

          <div className="mt-10">{view === "sources" ? <CatalogueSources /> : <FontLibrary />}</div>
        </section>

        <section id="saved" className="scroll-mt-24 pt-16">
          <SavedPairings />
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
