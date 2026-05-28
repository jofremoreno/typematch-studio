import type { FontRecord } from "@/data/fonts";
import { ExternalLink } from "lucide-react";

export function LicenseSource({ font }: { font: FontRecord }) {
  return (
    <section className="border-b border-border py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="label-eyebrow">07 — License &amp; source</span>
          <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
            Free typeface, informational link.
          </h2>
        </div>
        <div className="space-y-4 border border-border bg-card p-6">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="label-eyebrow">License</span>
            <span className="text-foreground">Free</span>
            <span className="label-eyebrow">Source</span>
            <span className="text-foreground">{font.sourceName}</span>
            <span className="label-eyebrow">Link</span>
            <a
              href={font.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
            >
              {font.sourceUrl.replace(/^https?:\/\//, "")}
              <ExternalLink size={12} />
            </a>
          </div>
          <p className="border-t border-border pt-4 text-xs text-muted-foreground">
            Always verify the license terms on the source before commercial
            use. TypeMatch Studio does not query any external font API — links
            are informational only.
          </p>
        </div>
      </div>
    </section>
  );
}