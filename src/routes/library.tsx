import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/typematch/header";
import { FontLibrary } from "@/components/typematch/font-library";
import { SavedPairings } from "@/components/typematch/saved-pairings";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — TypeMatch Studio" },
      { name: "description", content: "A curated local library of free, openly licensed typefaces with usage notes." },
      { property: "og:title", content: "Free typeface library — TypeMatch Studio" },
      { property: "og:description", content: "Browse free typefaces with classification, recommended medium and personality tags." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
        <span className="label-eyebrow">Library</span>
        <h1 className="font-editorial mt-3 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-tight">
          The full local catalogue of free typefaces.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Every font listed here is openly licensed and present in the local
          database. Click <em>Analyze</em> to see technical diagnosis, pairings,
          contrast behaviour and applied previews.
        </p>
        <div className="mt-10">
          <FontLibrary />
        </div>
        <div className="mt-16">
          <SavedPairings />
        </div>
      </main>
    </div>
  );
}