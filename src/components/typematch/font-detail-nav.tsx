import type { FontRecord } from "@/data/fonts";

const SECTIONS = [
  ["specimen", "Specimen"],
  ["compare", "Compare"],
  ["pairings", "Pairings"],
  ["preview", "In context"],
  ["diagnosis", "Diagnosis"],
  ["usage", "Usage"],
  ["license", "License"],
] as const;

export function FontDetailNav({ font }: { font: FontRecord }) {
  return (
    <div className="tm-font-detail-nav">
      <nav aria-label={`${font.name} page sections`} className="tm-font-detail-nav-links">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="tm-font-detail-nav-link">
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
