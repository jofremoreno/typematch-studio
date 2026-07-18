import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/typematch/header";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/licensing")({
  head: () => ({
    meta: [
      { title: "Licensing & sources — TypeMatch Studio" },
      {
        name: "description",
        content:
          "How TypeMatch Studio handles free, trial, paid and subscription typefaces. A directory of font sources and foundries.",
      },
      { property: "og:title", content: "Licensing clarity — TypeMatch Studio" },
      {
        property: "og:description",
        content:
          "Free, trial, paid and subscription typefaces — how they appear and how to use them responsibly.",
      },
    ],
  }),
  component: LicensingPage,
});

const BLOCKS = [
  {
    title: "Free / Open Source",
    body: "Can usually be used in commercial projects, but the official license should still be checked.",
  },
  {
    title: "Trial / Test",
    body: "For mockups, internal testing or evaluation. Not for final commercial use unless the license allows it.",
  },
  {
    title: "Paid / Subscription",
    body: "Requires a valid license or active subscription. This app only provides informational references and official links.",
  },
];

function LicensingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-[1920px] px-5 pb-32 sm:px-8 lg:px-[5.75vw]">
        <header className="tm-page-header">
          <span className="label-eyebrow">Licensing clarity</span>
          <h1>An informational tool — never a font distributor.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            TypeMatch Studio is an informational tool for comparing typefaces and building pairing
            strategies. It does not distribute, host or serve commercial font files. Font licensing
            varies by foundry, format and use case. Always verify the official license before using
            a typeface commercially.
          </p>
        </header>

        <section className="tm-page-panel tm-licensing-guide">
          <div className="tm-section-heading">
            <div>
              <span className="label-eyebrow">License states</span>
              <h2 className="mt-3">Three labels, one clear responsibility.</h2>
            </div>
            <p>
              These states explain how a typeface appears inside TypeMatch. The official provider
              remains the final authority for every project and use case.
            </p>
          </div>
          <div className="tm-licensing-grid">
            {BLOCKS.map((block, index) => (
              <article key={block.title}>
                <span className="font-mono-ui">0{index + 1}</span>
                <h3>{block.title}</h3>
                <p>{block.body}</p>
              </article>
            ))}
          </div>

          <div className="tm-licensing-source-cta">
            <div>
              <span className="label-eyebrow">Need the original provider?</span>
              <h3>Browse verified catalogue sources.</h3>
              <p>Foundries, libraries and directories now live together in Catalogue → Sources.</p>
            </div>
            <Link to="/catalogue" search={{ view: "sources" }} className="btn-card-primary">
              Open sources
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
