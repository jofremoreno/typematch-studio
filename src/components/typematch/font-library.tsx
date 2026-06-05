import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FONTS, type FontCategory, isPremiumReference } from "@/data/fonts";
import { LicenseBadges, availabilityLabel } from "./license-badges";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

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

  const FilterGroup = ({
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
    <div className="border-b border-border pb-3">
      <span className="label-eyebrow mb-2 block">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={
              "rounded-md border px-2 py-0.5 text-[10.5px] transition-colors " +
              (value === o
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground")
            }
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  const SourceGroup = () => {
    const collapsedCount = 8;
    const list = sourcesExpanded ? sources : sources.slice(0, collapsedCount);
    const hidden = sources.length - collapsedCount;
    return (
      <div className="pb-1">
        <span className="label-eyebrow mb-2 block">Source</span>
        <div className="flex flex-wrap gap-1">
          {list.map((o) => (
            <button
              key={o}
              onClick={() => setSource(o)}
              className={
                "rounded-md border px-2 py-0.5 text-[10.5px] transition-colors " +
                (source === o
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground")
              }
            >
              {o}
            </button>
          ))}
        </div>
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setSourcesExpanded((s) => !s)}
            className="ui-text mt-2 text-[10px] uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {sourcesExpanded ? "Show fewer sources" : `Show ${hidden} more sources`}
          </button>
        )}
      </div>
    );
  };

  const FiltersPanel = (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">Filters</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="ui-text text-[10px] uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <FilterGroup label="Category" options={CATEGORIES} value={category} onChange={(v) => setCategory(v as CategoryFilter)} />
      <FilterGroup label="Availability" options={AVAILS} value={availability} onChange={(v) => setAvailability(v as AvailabilityFilter)} />
      <FilterGroup label="Preview" options={PREVIEWS} value={preview} onChange={(v) => setPreview(v as PreviewFilter)} />
      <SourceGroup />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-[280px] lg:shrink-0">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-4">
          {FiltersPanel}
        </div>
      </aside>

      {/* Results column */}
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
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

        {/* Mobile filters trigger */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs uppercase tracking-widest text-foreground hover:border-foreground"
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeCount > 0 && (
                  <span className="ml-1 rounded-md border border-border bg-secondary px-1.5 text-[10px]">
                    {activeCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] max-w-[90vw] overflow-y-auto bg-card">
              <SheetHeader>
                <SheetTitle className="label-eyebrow text-left">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{FiltersPanel}</div>
            </SheetContent>
          </Sheet>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="ui-text text-[10px] uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

      <div className="grid-cards">
        {shown.map((f) => {
          const previewFamily =
            f.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : f.family;
          return (
            <article
              key={f.id}
              className="editorial-card safe-card group flex min-h-[340px] min-w-0 flex-col justify-between gap-6"
            >
              <header className="ui-text safe-row flex items-center justify-between gap-3">
                <span className="label-eyebrow shrink-0">{f.classification}</span>
                <span className="min-w-0 truncate text-right text-[10px] uppercase tracking-widest text-muted-foreground">
                  {availabilityLabel(f)} · {f.sourceName}
                </span>
              </header>
              <div className="type-preview">
                <p
                  className="text-[2.25rem] leading-[1.05] tracking-tight"
                  style={{ fontFamily: previewFamily }}
                >
                  {f.name}
                </p>
              </div>
              <div className="ui-text space-y-4">
                <LicenseBadges font={f} compact />
                <p className="text-xs text-muted-foreground">
                    {f.availability === "pay-what-you-want"
                      ? "Informational reference"
                      : isPremiumReference(f)
                        ? "Premium reference"
                        : `Best for ${f.bestMedium.toLowerCase()}`}
                </p>
                <div className="safe-row flex items-center gap-3">
                  <Link
                    to="/"
                    search={{ q: f.name } as never}
                    className="btn-card-primary flex-1"
                  >
                    Analyze
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
            className="rounded-lg border border-border bg-card px-5 py-2 text-xs uppercase tracking-widest text-foreground hover:border-foreground"
          >
            Load more — {Math.min(PAGE_SIZE, fonts.length - visible)} of {fonts.length - visible}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}