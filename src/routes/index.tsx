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
import { findFontByQuery } from "@/data/fonts";
import { Link } from "@tanstack/react-router";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Analyze — TypeMatch Studio" },
      {
        name: "description",
        content:
          "Analyze free typefaces and build pairings based on contrast, legibility and context. No random matches.",
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
        <section className="pb-12 pt-16 sm:pt-24">
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
            <Link to="/library" className="border border-border bg-card px-3 py-1.5 text-foreground hover:border-foreground">
              Explore free library →
            </Link>
            <p className="max-w-lg leading-relaxed">
              No random matches. No paid-font database. Every recommendation is
              based on local typographic attributes.
            </p>
          </div>
        </section>

        <div className="hairline" />

        {!query && <EmptyState />}

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
