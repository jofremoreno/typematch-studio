import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FONTS, type FontCategory, isPremiumReference } from "@/data/fonts";
import { LicenseBadges } from "./license-badges";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

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
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
    <div className="border-b border-border pb-4">
      <span className="label-eyebrow mb-3 block">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={
              "rounded-lg border px-3 py-1.5 text-[12px] leading-none transition-colors " +
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

  const SourceGroup = () => (
    <div className="pb-1">
      <span className="label-eyebrow mb-3 block">Source</span>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((o) => (
          <button
            key={o}
            onClick={() => setSource(o)}
            className={
              "rounded-lg border px-2.5 py-1 text-[11.5px] leading-none transition-colors " +
              (source === o
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

  const FiltersPanel = (
    <div className="flex flex-col gap-4">
      {/* Search inside the side menu — the only catalogue search */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 focus-within:border-foreground">
        <Search size={14} className="text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or foundry"
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="label-eyebrow">Filters</span>
        <span className="font-mono-ui text-[11px] text-muted-foreground">
          {fonts.length}/{FONTS.length}
        </span>
      </div>
      <FilterGroup label="Category" options={CATEGORIES} value={category} onChange={(v) => setCategory(v as CategoryFilter)} />
      <FilterGroup label="Availability" options={AVAILS} value={availability} onChange={(v) => setAvailability(v as AvailabilityFilter)} />
      <FilterGroup label="Preview" options={PREVIEWS} value={preview} onChange={(v) => setPreview(v as PreviewFilter)} />
      <SourceGroup />
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

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      {/* Desktop sidebar — sticky, always visible, search lives here */}
      <aside className="hidden lg:block lg:w-[320px] lg:shrink-0">
        <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
          {FiltersPanel}
        </div>
      </aside>

      {/* Results column */}
      <div className="min-w-0 flex-1">
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
            <SheetContent side="left" className="w-[340px] max-w-[92vw] overflow-y-auto bg-card">
              <SheetHeader>
                <SheetTitle className="label-eyebrow text-left">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{FiltersPanel}</div>
            </SheetContent>
          </Sheet>
          <span className="font-mono-ui text-xs text-muted-foreground">
            {fonts.length}/{FONTS.length}
          </span>
        </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((f) => {
          const previewFamily =
            f.canPreviewInApp === false ? "ui-sans-serif, system-ui, sans-serif" : f.family;
          const sourceShort = f.sourceName;
          return (
            <article
              key={f.id}
              className="editorial-card safe-card group flex aspect-square min-w-0 flex-col gap-3"
            >
              {/* 01 Meta — category · source */}
              <header className="ui-text flex flex-col gap-0.5">
                <span className="label-eyebrow">{f.classification}</span>
                <span className="label-eyebrow text-muted-foreground">{sourceShort}</span>
              </header>

              {/* 02 Preview — dominant font name */}
              <p
                className="min-w-0 break-words text-[clamp(1.5rem,2.1vw,2.125rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
                style={{ fontFamily: previewFamily }}
                title={f.name}
              >
                {f.name}
              </p>

              {/* 03 Sample — Aa Bb Cc 123 */}
              <p
                className="text-lg leading-none text-muted-foreground"
                style={{ fontFamily: previewFamily }}
              >
                Aa Bb Cc 123
              </p>

              <div className="mt-auto ui-text space-y-3">
                {/* 04 Badges — max 3 via compact */}
                <LicenseBadges font={f} compact />
                {isPremiumReference(f) && (
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Premium reference
                  </p>
                )}
                {/* 05 CTA — Analyze → */}
                <Link
                  to="/"
                  search={{ q: f.name } as never}
                  className="btn-card-primary w-full"
                >
                  Analyze
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lazy load sentinel + subtle status */}
      <div ref={sentinelRef} className="h-12" />
      {visible < fonts.length ? (
        <p className="ui-text mt-2 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Loading more typefaces…
        </p>
      ) : (
        fonts.length > PAGE_SIZE && (
          <p className="ui-text mt-2 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            End of catalogue — {fonts.length} typefaces
          </p>
        )
      )}
      </div>
    </div>
  );
}