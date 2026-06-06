import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/typematch/header";
import { FontOverview } from "@/components/typematch/font-overview";
import { TechnicalDiagnosis } from "@/components/typematch/technical-diagnosis";
import { UsageFit } from "@/components/typematch/usage-fit";
import { PairingRecommendations } from "@/components/typematch/pairing-recommendations";
import { ContrastBehaviour } from "@/components/typematch/contrast-behaviour";
import { PrintScreenSuitability } from "@/components/typematch/print-screen";
import { LicenseSource } from "@/components/typematch/license-source";
import { PairingPreview } from "@/components/typematch/pairing-preview";
import { MethodSection } from "@/components/typematch/method-section";
import { NotFoundState } from "@/components/typematch/not-found-state";
import { FontLibrary } from "@/components/typematch/font-library";
import { SavedPairings } from "@/components/typematch/saved-pairings";
import { findFontByQuery } from "@/data/fonts";
import { ArrowRight } from "lucide-react";

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
      <main className="mx-auto w-full max-w-7xl px-6 pb-32 sm:px-9">
        <section className="pb-10 pt-16 sm:pb-14 sm:pt-24">
          <span className="label-eyebrow">A typography tool, not a generator</span>
          <h1 className="mt-5 max-w-5xl text-[clamp(2.75rem,7vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em]">
            Typography pairing<br />with design logic.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Analyze typefaces, compare visual behaviour and build better
            combinations — browse the catalogue, filter by use and license,
            then dive into any specimen.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#library"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-xs uppercase tracking-[0.16em] text-foreground hover:border-foreground"
            >
              Explore the library
              <ArrowRight size={14} />
            </a>
            <span className="ui-text text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Or search a typeface inside the catalogue
            </span>
          </div>
        </section>

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

        {!font && (
          <section id="library" className="scroll-mt-24 pt-6 sm:pt-8">
            <div className="hairline mb-10" />
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
        )}
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
