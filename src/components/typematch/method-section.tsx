const ITEMS = [
  [
    "Category contrast",
    "How different the classifications are (sans / serif / mono / display) and how that contrast is read.",
  ],
  [
    "Structural compatibility",
    "X-height, width, aperture and rhythm — whether the two fonts share enough geometry to sit together.",
  ],
  [
    "Reading rhythm",
    "Whether the secondary font can carry long-form text without breaking the page's pace.",
  ],
  [
    "Role separation",
    "Whether headline, body, UI and accent roles can be assigned without ambiguity.",
  ],
  [
    "Screen / print suitability",
    "Where the pairing earns its place: backlit screens, paper, or both.",
  ],
  [
    "Personality alignment",
    "Whether the two voices reinforce or fight each other, and how to manage the tension.",
  ],
  [
    "Risk level",
    "Some pairings are safe systems, others are expressive — risk is named, not hidden.",
  ],
  ["License availability", "Only free, openly licensed typefaces are recommended."],
] as const;

export function MethodSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section
      className={
        standalone ? "tm-page-panel tm-method-section" : "tm-analysis-card tm-method-section"
      }
    >
      <div className="tm-section-heading">
        <div>
          <span className="label-eyebrow">{standalone ? "Method" : "09 — Method"}</span>
          <h2 className="mt-3">How recommendations are built.</h2>
        </div>
        <p>
          TypeMatch Studio doesn't generate random pairings. Every recommendation is derived from a
          local database of typographic attributes — the same criteria a designer would use when
          assembling a system, an editorial page or an identity.
        </p>
      </div>
      <ol className="tm-method-grid">
        {ITEMS.map(([title, body], i) => (
          <li key={title}>
            <span className="font-mono-ui">0{i + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
