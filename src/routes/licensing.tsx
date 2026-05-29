import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/typematch/header";
import { SOURCES } from "@/data/fonts";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/licensing")({
  head: () => ({
    meta: [
      { title: "Licensing & sources — TypeMatch Studio" },
      { name: "description", content: "How TypeMatch Studio handles free, trial, paid and subscription typefaces. A directory of font sources and foundries." },
      { property: "og:title", content: "Licensing clarity — TypeMatch Studio" },
      { property: "og:description", content: "Free, trial, paid and subscription typefaces — how they appear and how to use them responsibly." },
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
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
        <span className="label-eyebrow">Licensing clarity</span>
        <h1 className="font-editorial mt-3 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-tight">
          An informational tool — never a font distributor.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          TypeMatch Studio is an informational tool for comparing typefaces and
          building pairing strategies. It does not distribute, host or serve
          commercial font files. Font licensing varies by foundry, format and
          use case. Always verify the official license before using a typeface
          commercially.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {BLOCKS.map((b) => (
            <div key={b.title} className="border border-border bg-card p-5">
              <span className="label-eyebrow">{b.title}</span>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{b.body}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <span className="label-eyebrow">Source directory</span>
          <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
            Where the fonts in this catalogue come from.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Every link is informational only. TypeMatch Studio does not scrape,
            download or auto-import fonts.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-0 sm:grid-cols-2">
            {SOURCES.map((s, i) => (
              <article
                key={s.name}
                className={
                  "border-b border-border bg-card p-5 " +
                  ((i + 1) % 2 !== 0 ? "sm:border-r" : "")
                }
              >
                <header className="flex items-baseline justify-between gap-3">
                  <h3 className="font-editorial text-xl tracking-tight">{s.name}</h3>
                  <span className="label-eyebrow">{s.category}</span>
                </header>
                <dl className="mt-3 grid grid-cols-[110px_1fr] gap-y-1 text-xs">
                  <dt className="label-eyebrow">Type</dt><dd className="text-foreground">{s.type}</dd>
                  <dt className="label-eyebrow">License</dt><dd className="text-foreground">{s.licenseConfidence} confidence</dd>
                  <dt className="label-eyebrow">Role</dt><dd className="text-foreground">{s.role}</dd>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{s.notes}</p>
                <a
                  href={s.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-foreground underline-offset-4 hover:underline"
                >
                  {s.officialUrl.replace(/^https?:\/\//, "")} <ExternalLink size={12} />
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}