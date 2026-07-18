import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/typematch/header";
import { FontCard } from "@/components/typematch/font-card";
import { SavedPairings } from "@/components/typematch/saved-pairings";
import { PairingOfTheDay } from "@/components/typematch/pairing-of-the-day";
import { FONTS } from "@/data/fonts";
import { ArrowRight } from "lucide-react";

const featuredFonts = FONTS.filter((font) => font.canPreviewInApp !== false).slice(0, 4);

export const Route = createFileRoute("/")({
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
              <Link to="/catalogue" className="tm-home-cta tm-arrow-link group">
                Explore the catalogue
                <ArrowRight size={16} />
              </Link>
              <Link to="/foundries" className="tm-home-secondary">
                Explore type sources
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <PairingOfTheDay />
        </section>

        <section className="tm-page-panel tm-home-catalogue-preview">
          <div className="tm-section-heading">
            <div>
              <span className="label-eyebrow">Catalogue preview</span>
              <h2 className="mt-3">Start with four typefaces.</h2>
            </div>
            <p>
              Preview a selection here, then enter the catalogue to move between families and the
              foundries, libraries or directories behind them.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredFonts.map((featuredFont, index) => (
              <FontCard key={featuredFont.id} font={featuredFont} index={index} />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Link to="/catalogue" className="btn-card-primary">
              Open full catalogue
              <ArrowRight size={16} />
            </Link>
          </div>
          <div id="saved" className="mt-6 scroll-mt-24">
            <SavedPairings />
          </div>
        </section>
      </main>
    </div>
  );
}
