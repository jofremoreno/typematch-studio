import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FONTS, type FontCategory, isPremiumReference } from "@/data/fonts";
import { LicenseBadges, availabilityLabel } from "./license-badges";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type CategoryFilter = "All" | FontCategory;
type AvailabilityFilter =
  | "All"
  | "Free"
  | "Open Source"
  | "Trial"
  | "Paid"
  | "Subscription"
  | "Pay what you want";
type PreviewFilter = "All" | "Can preview in app" | "Fallback preview only";

const CATEGORIES: CategoryFilter[] = ["All", "Sans-serif", "Serif", "Mono", "Display"];
const AVAILS: AvailabilityFilter[] = ["All", "Free", "Open Source", "Trial", "Paid", "Subscription", "Pay what you want"];
const PREVIEWS: PreviewFilter[] = ["All", "Can preview in app", "Fallback preview only"];

function matchesAvailability(f: { availability?: string }, a: AvailabilityFilter): boolean {
  if (a === "All") return true;
  if (a === "Free") return f.availability === "free";
  if (a === "Open Source") return f.availability === "open-source";
  if (a === "Trial") return f.availability === "trial";
  if (a === "Paid") return f.availability === "paid";
  if (a === "Subscription") return f.availability === "subscription";
  if (a === "Pay what you want") return f.availability === "pay-what-you-want";
  return true;
}

const PAGE_SIZE = 40;

export function FontLibrary() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [availability, setAvailability] = useState<AvailabilityFilter>("All");
  const [preview, setPreview] = useState<PreviewFilter>("All");
  const [source, setSource] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  // Reset visible window on any filter change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setVisible(PAGE_SIZE), [category, availability, preview, source, query]);
  const shown = fonts.slice(0, visible);

  const activeCount =
    (category !== "All" ? 1 : 0) +
    (availability !== "All" ? 1 : 0) +
    (preview !== "All" ? 1 : 0) +
    (source !== "All" ? 1 : 0);

  const clearFilters = () => {
    setCategory("All");
    setAvailability("All");
    setPreview("All");
    setSource("All");
  };

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

      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <div className="flex items-center justify-between gap-3 border-b border-border py-2.5">
          <CollapsibleTrigger className="ui-text group flex flex-1 items-center gap-3 text-left">
            <ChevronDown
              className={
                "h-3.5 w-3.5 text-muted-foreground transition-transform " +
                (filtersOpen ? "rotate-0" : "-rotate-90")
              }
            />
            <span className="label-eyebrow">Filters</span>
            <span className="text-xs text-muted-foreground">
              {activeCount > 0
                ? `${activeCount} active`
                : "Category · Availability · Preview · Source"}
            </span>
          </CollapsibleTrigger>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="ui-text text-[10px] uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <FilterRow label="Category" options={CATEGORIES} value={category} onChange={(v) => setCategory(v as CategoryFilter)} />
          <FilterRow label="Availability" options={AVAILS} value={availability} onChange={(v) => setAvailability(v as AvailabilityFilter)} />
          <FilterRow label="Preview" options={PREVIEWS} value={preview} onChange={(v) => setPreview(v as PreviewFilter)} />
          <FilterRow label="Source" options={sources} value={source} onChange={setSource} />
        </CollapsibleContent>
      </Collapsible>

      <div className="mt-6 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((f, i) => {
          const previewFamily =
            f.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : f.family;
          return (
            <article
              key={f.id}
              className={
                "card-elevated group flex flex-col justify-between gap-6 border-border p-6 " +
                "border-b " +
                ((i + 1) % 3 !== 0 ? "lg:border-r " : "") +
                ((i + 1) % 2 !== 0 ? "sm:border-r lg:border-r " : "")
              }
            >
              <header className="ui-text flex items-center justify-between">
                <span className="label-eyebrow">{f.classification}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {availabilityLabel(f)} · {f.sourceName}
                </span>
              </header>
              <div className="type-preview">
                <p
                  className="text-5xl leading-none tracking-tight"
                  style={{ fontFamily: previewFamily }}
                >
                  {f.name}
                </p>
              </div>
              <div className="ui-text space-y-3">
                <LicenseBadges font={f} compact />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {f.availability === "pay-what-you-want"
                      ? "Informational reference"
                      : isPremiumReference(f)
                        ? "Premium reference"
                        : `Best for ${f.bestMedium.toLowerCase()}`}
                  </span>
                  <Link
                    to="/"
                    search={{ q: f.name } as never}
                    className="cta-accent inline-flex items-center gap-1.5 rounded-sm border bg-background px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground"
                  >
                    Analyze →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {visible < fonts.length && (
        <div className="ui-text mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="border border-border bg-card px-5 py-2 text-xs uppercase tracking-widest text-foreground hover:border-foreground"
          >
            Load more — {Math.min(PAGE_SIZE, fonts.length - visible)} of {fonts.length - visible}
          </button>
        </div>
      )}
    </div>
  );
}