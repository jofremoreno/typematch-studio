import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/typematch/header";
import { FontLibrary } from "@/components/typematch/font-library";
import { CatalogueSources } from "@/components/typematch/catalogue-sources";
import { AnimatedNumber } from "@/components/typematch/animated-number";
import { FONTS, SOURCES } from "@/data/fonts";

const searchSchema = z.object({
  view: z.enum(["typefaces", "sources"]).optional(),
});

export const Route = createFileRoute("/catalogue")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Catalogue — TypeMatch Studio" },
      {
        name: "description",
        content: "Explore typefaces, foundries, libraries and directories in one catalogue.",
      },
    ],
  }),
  component: CataloguePage,
});

function CataloguePage() {
  const { view = "typefaces" } = Route.useSearch();
  const previewable = FONTS.filter((font) => font.canPreviewInApp !== false).length;
  const free = FONTS.filter(
    (font) => font.availability === "free" || font.availability === "open-source",
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-[1920px] px-5 pb-32 sm:px-8 lg:px-[5.75vw]">
        <header className="tm-page-header">
          <span className="label-eyebrow">TypeMatch catalogue</span>
          <div className="mt-3 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.52fr)] lg:items-end">
            <div>
              <h1>Typefaces and their sources, together.</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Browse type families, understand where they come from and move directly between a
                source and every family represented in the catalogue.
              </p>
            </div>
            <dl className="tm-stat-grid">
              <Stat label="Families" value={FONTS.length} />
              <Stat label="Sources" value={SOURCES.length} />
              <Stat label="Live previews" value={previewable} />
              <Stat label="Open / Free" value={free} />
            </dl>
          </div>
        </header>

        <nav className="tm-catalogue-switcher" aria-label="Catalogue view">
          <Link
            to="/catalogue"
            search={{ view: "typefaces" }}
            className="tm-catalogue-switcher-link"
            data-active={view === "typefaces"}
            aria-current={view === "typefaces" ? "page" : undefined}
          >
            <span>01</span>
            Typefaces
            <strong>{FONTS.length}</strong>
          </Link>
          <Link
            to="/catalogue"
            search={{ view: "sources" }}
            className="tm-catalogue-switcher-link"
            data-active={view === "sources"}
            aria-current={view === "sources" ? "page" : undefined}
          >
            <span>02</span>
            Sources
            <strong>{SOURCES.length}</strong>
          </Link>
        </nav>

        <section className="mt-10">
          {view === "sources" ? <CatalogueSources /> : <FontLibrary />}
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
