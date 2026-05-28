import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/typematch/header";
import { MethodSection } from "@/components/typematch/method-section";

export const Route = createFileRoute("/method")({
  head: () => ({
    meta: [
      { title: "Method — TypeMatch Studio" },
      { name: "description", content: "How TypeMatch Studio builds typography recommendations — local attributes, contrast logic and risk." },
      { property: "og:title", content: "Method — TypeMatch Studio" },
      { property: "og:description", content: "How recommendations are built. No random matches; only local typographic attributes." },
    ],
  }),
  component: MethodPage,
});

function MethodPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
        <span className="label-eyebrow">Method</span>
        <h1 className="font-editorial mt-3 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-tight">
          A typographic tool with criteria, not a font lottery.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          TypeMatch Studio analyses typefaces against a local set of attributes
          a designer would use to assemble a system, an editorial page or an
          identity. The same input always produces the same recommendation —
          and every recommendation explains its reasoning, including its risks.
        </p>
        <div className="mt-12">
          <MethodSection standalone />
        </div>
        <div className="mt-16 border-t border-border pt-10">
          <h2 className="font-editorial text-2xl tracking-tight">What this tool is not</h2>
          <ul className="mt-4 max-w-2xl space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>— Not a generator of random font pairings.</li>
            <li>— Not connected to any external API or font marketplace.</li>
            <li>— Not a recommender of paid or premium typefaces.</li>
            <li>— Not a substitute for verifying license terms before commercial use.</li>
          </ul>
          <div className="mt-8 flex gap-3">
            <Link to="/" className="bg-foreground px-4 py-2 text-sm text-background">Analyze a typeface</Link>
            <Link to="/library" className="border border-border px-4 py-2 text-sm">Browse library</Link>
          </div>
        </div>
      </main>
    </div>
  );
}