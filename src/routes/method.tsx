import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/typematch/header";
import { MethodSection } from "@/components/typematch/method-section";

export const Route = createFileRoute("/method")({
  head: () => ({
    meta: [
      { title: "Method — TypeMatch Studio" },
      {
        name: "description",
        content:
          "How TypeMatch Studio builds typography recommendations — local attributes, contrast logic and risk.",
      },
      { property: "og:title", content: "Method — TypeMatch Studio" },
      {
        property: "og:description",
        content:
          "How recommendations are built. No random matches; only local typographic attributes.",
      },
    ],
  }),
  component: MethodPage,
});

function MethodPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-[1920px] px-5 pb-32 sm:px-8 lg:px-[5.75vw]">
        <header className="tm-page-header">
          <span className="label-eyebrow">Method</span>
          <h1>A typographic tool with criteria, not a font lottery.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            TypeMatch Studio analyses typefaces against a local set of attributes a designer would
            use to assemble a system, an editorial page or an identity. The same input always
            produces the same recommendation — and every recommendation explains its reasoning,
            including its risks.
          </p>
        </header>
        <div className="mt-6">
          <MethodSection standalone />
        </div>
        <section className="tm-page-panel tm-method-boundaries">
          <div className="tm-section-heading">
            <div>
              <span className="label-eyebrow">Boundaries</span>
              <h2 className="mt-3">What this tool is not.</h2>
            </div>
            <p>Clear limits keep the recommendations useful, transparent and safe to apply.</p>
          </div>
          <ul>
            <li>
              <span>01</span>Not a generator of random font pairings.
            </li>
            <li>
              <span>02</span>Not connected to an external font API or marketplace.
            </li>
            <li>
              <span>03</span>Not a distributor of paid or premium font files.
            </li>
            <li>
              <span>04</span>Not a substitute for verifying commercial license terms.
            </li>
          </ul>
          <div className="tm-method-actions">
            <Link to="/catalogue" className="btn-card-primary">
              Analyze a typeface
            </Link>
            <Link to="/licensing" className="btn-card-secondary">
              Review licensing
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
