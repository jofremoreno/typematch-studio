const ITEMS = [
  ["Category contrast", "How different the classifications are (sans / serif / mono / display) and how that contrast is read."],
  ["Structural compatibility", "X-height, width, aperture and rhythm — whether the two fonts share enough geometry to sit together."],
  ["Reading rhythm", "Whether the secondary font can carry long-form text without breaking the page's pace."],
  ["Role separation", "Whether headline, body, UI and accent roles can be assigned without ambiguity."],
  ["Screen / print suitability", "Where the pairing earns its place: backlit screens, paper, or both."],
  ["Personality alignment", "Whether the two voices reinforce or fight each other, and how to manage the tension."],
  ["Risk level", "Some pairings are safe systems, others are expressive — risk is named, not hidden."],
  ["License availability", "Only free, openly licensed typefaces are recommended."],
] as const;

export function MethodSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section className={standalone ? "" : "border-b border-border py-14"}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.4fr]">
        <div>
          <span className="label-eyebrow">{standalone ? "Method" : "09 — Method"}</span>
          <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
            How recommendations are built.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            TypeMatch Studio doesn't generate random pairings. Every recommendation
            is derived from a local database of typographic attributes — the same
            criteria a designer would use when assembling a system, an editorial
            page or an identity.
          </p>
        </div>
        <ol className="space-y-0 border-t border-border">
          {ITEMS.map(([title, body], i) => (
            <li key={title} className="grid grid-cols-[40px_1fr] gap-4 border-b border-border py-5">
              <span className="font-mono-ui pt-1 text-xs text-muted-foreground">0{i + 1}</span>
              <div>
                <h3 className="text-base text-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}