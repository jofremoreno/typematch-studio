import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Search, X } from "lucide-react";
import { FONTS, SOURCES } from "@/data/fonts";
import { foundrySlug } from "@/lib/foundries";

type SourceCategory = "all" | "free" | "premium" | "directory" | "subscription";

const categories: { value: SourceCategory; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "free", label: "Open source / Free" },
  { value: "premium", label: "Commercial" },
  { value: "subscription", label: "Subscription" },
  { value: "directory", label: "Directories" },
];

const categoryLabels: Record<string, string> = {
  free: "Open source / Free",
  premium: "Commercial",
  directory: "Directory",
  subscription: "Subscription",
};

export function CatalogueSources() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SourceCategory>("all");

  const sources = useMemo(() => {
    const familiesBySource = new Map<string, typeof FONTS>();
    for (const font of FONTS) {
      const families = familiesBySource.get(font.sourceName) ?? [];
      families.push(font);
      familiesBySource.set(font.sourceName, families);
    }

    const normalizedQuery = query.trim().toLowerCase();
    return SOURCES.map((source) => {
      const families = familiesBySource.get(source.name) ?? [];
      return {
        ...source,
        slug: foundrySlug(source.name),
        families,
      };
    })
      .filter((source) => category === "all" || source.category === category)
      .filter((source) => {
        if (!normalizedQuery) return true;
        return [source.name, source.type, source.notes, ...source.families.map((font) => font.name)]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => b.families.length - a.families.length || a.name.localeCompare(b.name));
  }, [category, query]);

  return (
    <div className="min-w-0">
      <div className="tm-toolbar -mx-5 mb-8 px-5 py-3 sm:-mx-8 sm:px-8 lg:-mx-[5.75vw] lg:px-[5.75vw]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-0 items-baseline gap-3">
            <span className="font-editorial text-[15px] tracking-tight text-foreground">
              Catalogue Sources
            </span>
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {sources.length} / {SOURCES.length} sources
            </span>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <label className="tm-chip !gap-1.5 !pr-2 focus-within:border-foreground">
              <Search size={12} className="text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search sources and their typefaces"
                placeholder="Search source or font"
                className="w-40 min-w-0 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground sm:w-52"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear source search"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </label>

            <div className="flex max-w-full gap-1 overflow-x-auto" aria-label="Source category">
              {categories.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value)}
                  aria-pressed={category === item.value}
                  className="tm-chip"
                  data-active={category === item.value}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {sources.length} sources match the current search and filter.
      </p>

      {sources.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sources.map((source, index) => {
            const sampleNames = source.families.slice(0, 3).map((font) => font.name);
            return (
              <article
                key={source.name}
                className="tm-source-card group"
                style={{ animationDelay: `${Math.min(index % 8, 7) * 35}ms` }}
              >
                <div className="tm-source-card-meta">
                  <span>{categoryLabels[source.category] ?? source.category}</span>
                  <span className="font-mono-ui tabular-nums">
                    {source.families.length} {source.families.length === 1 ? "family" : "families"}
                  </span>
                </div>

                <Link
                  to="/foundries/$slug"
                  params={{ slug: source.slug }}
                  className="tm-source-card-stage"
                  aria-label={`View ${source.name}`}
                >
                  <span className="tm-source-card-monogram" aria-hidden="true">
                    {source.name.slice(0, 2)}
                  </span>
                  <h2>{source.name}</h2>
                  <p>{source.type}</p>
                </Link>

                <div className="tm-source-card-copy">
                  <p>{source.notes}</p>
                  {sampleNames.length > 0 && (
                    <p className="tm-source-card-families">{sampleNames.join(" · ")}</p>
                  )}
                </div>

                <div className="tm-source-card-actions">
                  <Link
                    to="/foundries/$slug"
                    params={{ slug: source.slug }}
                    className="btn-card-primary flex-1"
                  >
                    Explore source
                    <ArrowRight size={16} />
                  </Link>
                  <a
                    href={source.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-card-secondary"
                    aria-label={`Open the official ${source.name} website`}
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="text-sm font-medium">No sources match this search</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="tm-chip mt-5"
          >
            Clear search and filters
          </button>
        </div>
      )}
    </div>
  );
}
