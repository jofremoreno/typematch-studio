import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FONTS, type FontCategory, isPremiumReference } from "@/data/fonts";
import { LicenseBadges, availabilityLabel } from "./license-badges";

type CategoryFilter = "All" | FontCategory;
type AvailabilityFilter =
  | "All"
  | "Free"
  | "Open Source"
  | "Trial"
  | "Paid"
  | "Subscription";
type PreviewFilter = "All" | "Can preview in app" | "Fallback preview only";

const CATEGORIES: CategoryFilter[] = ["All", "Sans-serif", "Serif", "Mono", "Display"];
const AVAILS: AvailabilityFilter[] = ["All", "Free", "Open Source", "Trial", "Paid", "Subscription"];
const PREVIEWS: PreviewFilter[] = ["All", "Can preview in app", "Fallback preview only"];

function matchesAvailability(f: { availability?: string }, a: AvailabilityFilter): boolean {
  if (a === "All") return true;
  if (a === "Free") return f.availability === "free";
  if (a === "Open Source") return f.availability === "open-source";
  if (a === "Trial") return f.availability === "trial";
  if (a === "Paid") return f.availability === "paid";
  if (a === "Subscription") return f.availability === "subscription";
  return true;
}

export function FontLibrary() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [availability, setAvailability] = useState<AvailabilityFilter>("All");
  const [preview, setPreview] = useState<PreviewFilter>("All");
  const [source, setSource] = useState<string>("All");
  const [query, setQuery] = useState("");

  const sources = useMemo(
    () => ["All", ...Array.from(new Set(FONTS.map((f) => f.sourceName))).sort()],
    [],
  );

  const fonts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FONTS.filter((f) => {
      if (category !== "All" && f.classification !== category) return false;
      if (!matchesAvailability(f, availability)) return false;
      if (preview === "Can preview in app" && f.canPreviewInApp === false) return false;
      if (preview === "Fallback preview only" && f.canPreviewInApp !== false) return false;
      if (source !== "All" && f.sourceName !== source) return false;
      if (q && !f.name.toLowerCase().includes(q) && !(f.foundry ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, availability, preview, source, query]);

  const FilterRow = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: readonly string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-wrap items-center gap-2 border-b border-border py-3">
      <span className="label-eyebrow mr-2 w-24">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={
            "border px-3 py-1.5 text-xs transition-colors " +
            (value === o
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card text-muted-foreground hover:text-foreground")
          }
        >
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 border-b border-border py-3">
        <span className="label-eyebrow">Search</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name or foundry…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <span className="font-mono-ui text-xs text-muted-foreground">
          {fonts.length} / {FONTS.length}
        </span>
      </div>

      <FilterRow label="Category" options={CATEGORIES} value={category} onChange={(v) => setCategory(v as CategoryFilter)} />
      <FilterRow label="Availability" options={AVAILS} value={availability} onChange={(v) => setAvailability(v as AvailabilityFilter)} />
      <FilterRow label="Preview" options={PREVIEWS} value={preview} onChange={(v) => setPreview(v as PreviewFilter)} />
      <FilterRow label="Source" options={sources} value={source} onChange={setSource} />

      <div className="mt-6 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {fonts.map((f, i) => {
          const previewFamily =
            f.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : f.family;
          return (
            <article
              key={f.id}
              className={
                "group flex flex-col justify-between gap-6 border-border bg-card p-6 transition-colors hover:bg-secondary " +
                "border-b " +
                ((i + 1) % 3 !== 0 ? "lg:border-r " : "") +
                ((i + 1) % 2 !== 0 ? "sm:border-r lg:border-r " : "")
              }
            >
              <header className="flex items-center justify-between">
                <span className="label-eyebrow">{f.classification}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {availabilityLabel(f)} · {f.sourceName}
                </span>
              </header>
              <p
                className="text-5xl leading-none tracking-tight"
                style={{ fontFamily: previewFamily }}
              >
                {f.name}
              </p>
              <div className="space-y-3">
                <LicenseBadges font={f} compact />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{isPremiumReference(f) ? "Premium reference" : `Best for ${f.bestMedium.toLowerCase()}`}</span>
                  <Link
                    to="/"
                    search={{ q: f.name } as never}
                    className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
                  >
                    Analyze →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}