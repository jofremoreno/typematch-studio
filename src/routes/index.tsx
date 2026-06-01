import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/typematch/header";
import { FontSearch } from "@/components/typematch/font-search";
import { FontOverview } from "@/components/typematch/font-overview";
import { TechnicalDiagnosis } from "@/components/typematch/technical-diagnosis";
import { UsageFit } from "@/components/typematch/usage-fit";
import { PairingRecommendations } from "@/components/typematch/pairing-recommendations";
import { ContrastBehaviour } from "@/components/typematch/contrast-behaviour";
import { PrintScreenSuitability } from "@/components/typematch/print-screen";
import { LicenseSource } from "@/components/typematch/license-source";
import { PairingPreview } from "@/components/typematch/pairing-preview";
import { MethodSection } from "@/components/typematch/method-section";
import { EmptyState } from "@/components/typematch/empty-state";
import { NotFoundState } from "@/components/typematch/not-found-state";
import { FontLibrary } from "@/components/typematch/font-library";
import { SavedPairings } from "@/components/typematch/saved-pairings";
import { findFontByQuery } from "@/data/fonts";
import { Link } from "@tanstack/react-router";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Explore — TypeMatch Studio" },
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
  const { q } = Route.useSearch();
  const query = (q ?? "").trim();
  const font = query ? findFontByQuery(query) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <section className="pb-6 pt-16 sm:pb-8 sm:pt-24">
          <span className="label-eyebrow">A typography tool, not a generator</span>
          <h1 className="font-editorial mt-4 max-w-4xl text-[clamp(2.5rem,6.5vw,5rem)] leading-[0.98] tracking-tight">
            Typography pairing with design logic.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Analyze free typefaces and build pairings based on contrast,
            legibility, hierarchy and context.
          </p>
          <div className="mt-10 max-w-3xl">
            <FontSearch defaultValue={query} />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <a href="#library" className="border border-border bg-card px-3 py-1.5 text-foreground hover:border-foreground">
              Jump to library ↓
            </a>
            <p className="max-w-lg leading-relaxed">
              No random matches. No paid-font database. Every recommendation is
              based on local typographic attributes.
            </p>
          </div>
        </section>

        {/* {!query && <EmptyState />} */}

        {query && !font && (
          <div className="py-12">
            <NotFoundState query={query} />
          </div>
        )}

        {font && (
          <article className="pt-12">
            <FontOverview font={font} />
            <TechnicalDiagnosis font={font} />
            <UsageFit font={font} />
            <PairingRecommendations font={font} />
            <ContrastBehaviour font={font} />
            <PrintScreenSuitability font={font} />
            <LicenseSource font={font} />
            <PairingPreview font={font} />
            <MethodSection />
          </article>
        )}

        <section id="library" className="pt-6 scroll-mt-24 sm:pt-10">
          <div className="hairline mb-12" />
          <span className="label-eyebrow">Library</span>
          <h2 className="font-editorial mt-3 max-w-3xl text-[clamp(1.875rem,4vw,3rem)] leading-[1.05] tracking-tight">
            Explore the type library
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Browse local typefaces, filter by use, license and source, then
            analyze or compare.
          </p>
          <div className="mt-10">
            <FontLibrary />
          </div>
          <div className="mt-16">
            <SavedPairings />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-xs text-muted-foreground sm:px-8">
        <span>
          <span className="font-editorial text-foreground">TypeMatch Studio</span> — analysis, pairing &amp; criteria.
        </span>
        <span>Free typefaces only · Local database · No external APIs.</span>
      </div>
    </footer>
  );
}
