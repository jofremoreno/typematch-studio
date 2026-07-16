import { useEffect, useMemo, useRef, useState } from "react";
import { FONTS, type FontCategory } from "@/data/fonts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  Rows3,
  X,
  ChevronDown,
} from "lucide-react";
import { FontCard, FontRow } from "./font-card";
import { CompareChip } from "./compare-chip";

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
type SortKey = "name" | "recent" | "screen" | "print" | "versatility";
type ViewMode = "cards" | "list";

const CATEGORIES: CategoryFilter[] = ["All", "Sans-serif", "Serif", "Mono", "Display"];
const AVAILS: AvailabilityFilter[] = ["All", "Free", "Open Source", "Trial", "Paid", "Subscription", "Pay what you want"];
const PREVIEWS: PreviewFilter[] = ["All", "Can preview in app", "Fallback preview only"];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name (A→Z)" },
  { key: "recent", label: "Catalogue order" },
  { key: "screen", label: "Best for screen" },
  { key: "print", label: "Best for print" },
  { key: "versatility", label: "Most versatile" },
];

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
  const [sort, setSort] = useState<SortKey>("name");
  const [view, setView] = useState<ViewMode>("cards");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const sources = useMemo(
    () => ["All", ...Array.from(new Set(FONTS.map((f) => f.sourceName))).sort()],
    [],
  );

  const fonts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = FONTS.filter((f) => {
      if (category !== "All" && f.classification !== category) return false;
      if (!matchesAvailability(f, availability)) return false;
      if (preview === "Can preview in app" && f.canPreviewInApp === false) return false;
      if (preview === "Fallback preview only" && f.canPreviewInApp !== false) return false;
      if (source !== "All" && f.sourceName !== source) return false;
      if (q && !f.name.toLowerCase().includes(q) && !(f.foundry ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
    const sorted = [...filtered];
    switch (sort) {
      case "name": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "screen": sorted.sort((a, b) => b.screenScore - a.screenScore); break;
      case "print": sorted.sort((a, b) => b.printScore - a.printScore); break;
      case "versatility": sorted.sort((a, b) => b.versatilityScore - a.versatilityScore); break;
      default: break;
    }
    return sorted;
  }, [category, availability, preview, source, query, sort]);

  // Reset visible window on any filter change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => setVisible(PAGE_SIZE), [category, availability, preview, source, query, sort]);
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
    setQuery("");
  };

  // Infinite scroll — observe sentinel near bottom and load next page.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => (v < fonts.length ? v + PAGE_SIZE : v));
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fonts.length]);

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
    <div className="border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="label-eyebrow mb-3 block">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={
              "rounded-lg border px-2.5 py-1.5 text-[11.5px] leading-none transition-colors " +
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

  const filtersPanel = (
    <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
      <FilterGroup label="Category" options={CATEGORIES} value={category} onChange={(v) => setCategory(v as CategoryFilter)} />
      <FilterGroup label="Availability" options={AVAILS} value={availability} onChange={(v) => setAvailability(v as AvailabilityFilter)} />
      <FilterGroup label="Preview" options={PREVIEWS} value={preview} onChange={(v) => setPreview(v as PreviewFilter)} />
      <FilterGroup label="Source" options={sources} value={source} onChange={setSource} />
      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearFilters}
          className="ui-text mt-1 self-start text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  const activeSortLabel = SORTS.find((s) => s.key === sort)?.label ?? "Sort";

  return (
    <div className="min-w-0">
      {/* Sticky toolbar */}
      <div className="tm-toolbar -mx-6 mb-8 px-6 py-3 sm:-mx-9 sm:px-9">
        <div className="flex flex-wrap items-center gap-3">
          {/* Left cluster */}
          <div className="flex min-w-0 items-baseline gap-3">
            <span className="font-editorial text-[15px] tracking-tight text-foreground">
              TypeMatch Library
            </span>
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {fonts.length} / {FONTS.length} fonts
            </span>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* Search */}
            <label className="tm-chip !gap-1.5 !pr-2 focus-within:border-foreground">
              <Search size={13} className="text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search font or foundry"
                className="w-40 min-w-0 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground sm:w-52"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </label>

            {/* View toggle */}
            <div className="inline-flex overflow-hidden rounded-[10px] border border-border">
              <button
                type="button"
                onClick={() => setView("cards")}
                aria-pressed={view === "cards"}
                title="Cards view"
                className={
                  "flex h-9 w-9 items-center justify-center transition-colors " +
                  (view === "cards"
                    ? "bg-foreground text-background"
                    : "bg-transparent text-muted-foreground hover:text-foreground")
                }
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                title="List view"
                className={
                  "flex h-9 w-9 items-center justify-center border-l border-border transition-colors " +
                  (view === "list"
                    ? "bg-foreground text-background"
                    : "bg-transparent text-muted-foreground hover:text-foreground")
                }
              >
                <Rows3 size={14} />
              </button>
            </div>

            {/* Filters popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="tm-chip" data-active={activeCount > 0}>
                  <SlidersHorizontal size={13} />
                  Filters
                  {activeCount > 0 && (
                    <span className="rounded-md bg-background/20 px-1.5 text-[10px] font-mono-ui tabular-nums">
                      {activeCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[340px] rounded-2xl border-border bg-card p-5">
                {filtersPanel}
              </PopoverContent>
            </Popover>

            {/* Sort popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="tm-chip">
                  <ArrowUpDown size={13} />
                  <span className="hidden sm:inline">{activeSortLabel}</span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown size={12} className="text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 rounded-2xl border-border bg-card p-2">
                <div className="flex flex-col">
                  {SORTS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSort(s.key)}
                      className={
                        "flex items-center justify-between rounded-lg px-3 py-2 text-left text-[12.5px] transition-colors " +
                        (sort === s.key
                          ? "bg-foreground text-background"
                          : "text-foreground hover:bg-secondary")
                      }
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <CompareChip />
          </div>
        </div>
      </div>

      {/* Results */}
      {view === "cards" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((f) => (
            <FontCard key={f.id} font={f} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map((f) => (
            <FontRow key={f.id} font={f} />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel + skeletons */}
      <div ref={sentinelRef} className="h-8" />
      {visible < fonts.length && (
        view === "cards" ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="tm-skeleton h-[340px]" />
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="tm-skeleton h-24" />
            ))}
          </div>
        )
      )}
      {visible >= fonts.length && fonts.length === 0 && (
        <p className="ui-text mt-10 text-center text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
          No typefaces match these filters
        </p>
      )}
    </div>
  );
}