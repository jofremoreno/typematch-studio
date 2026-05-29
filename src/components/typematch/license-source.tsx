import type { FontRecord } from "@/data/fonts";
import { ExternalLink } from "lucide-react";
import {
  LicenseBadges,
  licensingNotice,
  sourceButtonLabel,
  availabilityLabel,
} from "./license-badges";

export function LicenseSource({ font }: { font: FontRecord }) {
  const notice = licensingNotice(font);
  return (
    <section className="border-b border-border py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="label-eyebrow">07 — License &amp; source</span>
          <h2 className="font-editorial mt-3 text-3xl tracking-tight sm:text-4xl">
            Licensing &amp; source.
          </h2>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">
            TypeMatch Studio is an informational tool. It does not host or
            serve font files. Always verify the official license on the source.
          </p>
        </div>
        <div className="space-y-4 border border-border bg-card p-6">
          <LicenseBadges font={font} />
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="label-eyebrow">Availability</span>
            <span className="text-foreground">{availabilityLabel(font)}</span>
            <span className="label-eyebrow">License</span>
            <span className="text-foreground">{font.licenseName ?? "—"}</span>
            <span className="label-eyebrow">Commercial use</span>
            <span className="text-foreground">
              {font.canUseCommercially === true
                ? "Yes"
                : font.canUseCommercially === false
                  ? "No"
                  : font.canUseCommercially === "depends"
                    ? "Depends on provider"
                    : "Requires license"}
            </span>
            <span className="label-eyebrow">Foundry</span>
            <span className="text-foreground">{font.foundry ?? "—"}</span>
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
          <a
            href={font.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-4 py-2 text-xs uppercase tracking-widest text-background hover:bg-accent hover:text-accent-foreground"
          >
            {sourceButtonLabel(font)} <ExternalLink size={12} />
          </a>
          {notice && (
            <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              {notice}
            </p>
          )}
          <p className="border-t border-border pt-4 text-xs text-muted-foreground">
            Always verify the license terms on the source before commercial use.
            TypeMatch Studio does not distribute font files or query external APIs.
          </p>
        </div>
      </div>
    </section>
  );
}