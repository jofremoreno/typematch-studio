import { Link } from "@tanstack/react-router";
import { FONTS } from "@/data/fonts";

export function EmptyState() {
  const featured = ["inter", "playfair-display", "space-grotesk", "fraunces", "ibm-plex-mono", "source-serif-4"]
    .map((id) => FONTS.find((f) => f.id === id)!)
    .filter(Boolean);

  return (
    <section className="border-t border-border pt-12">
      <div className="flex items-end justify-between">
        <div>
          <span className="label-eyebrow">Start here</span>
          <h2 className="font-editorial mt-2 text-3xl tracking-tight sm:text-4xl">
            A few free typefaces to analyze.
          </h2>
        </div>
        <Link to="/library" className="hidden text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline md:inline">
          Explore the full library →
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((f) => (
          <Link
            key={f.id}
            to="/"
            search={{ q: f.name } as never}
            className="group block border border-border bg-card p-6 transition-colors hover:border-foreground"
          >
            <div className="flex items-baseline justify-between">
              <span className="label-eyebrow">{f.classification}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.bestMedium}</span>
            </div>
            <p className="mt-6 text-4xl leading-none tracking-tight" style={{ fontFamily: f.family }}>
              {f.name}
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              {f.personality.slice(0, 3).join(" · ")}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}