import { Link } from "@tanstack/react-router";
import { suggestSimilarFree } from "@/data/fonts";

export function NotFoundState({ query }: { query: string }) {
  const suggestions = suggestSimilarFree(query);
  return (
    <section className="border border-border bg-card p-10">
      <span className="label-eyebrow">Result</span>
      <h2 className="font-editorial mt-2 text-3xl tracking-tight sm:text-4xl">
        “{query}” is not in the local free-font database yet.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        TypeMatch Studio only recommends typefaces present in its local database
        of free, openly licensed fonts. We won't invent attributes, scores or
        download links for fonts we don't have data on.
      </p>
      <ul className="mt-4 space-y-1 text-sm text-foreground">
        <li>— Font not found in local database.</li>
        <li>— Consider adding it manually with verified attributes.</li>
        <li>— Or try a similar free alternative below.</li>
      </ul>

      <div className="mt-8">
        <span className="label-eyebrow">Similar free alternatives</span>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((f) => (
            <Link
              key={f.id}
              to="/"
              search={{ q: f.name } as never}
              className="block border border-border bg-background p-4 transition-colors hover:border-foreground"
            >
              <p className="text-xl" style={{ fontFamily: f.family }}>
                {f.name}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {f.classification} · {f.bestMedium}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}