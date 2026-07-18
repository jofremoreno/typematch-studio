import type { FontRecord } from "@/data/fonts";
import { ExternalLink } from "lucide-react";
import { LicenseBadges } from "./license-badges";
import { availabilityLabel, licensingNotice, sourceButtonLabel } from "./license-utils";

export function LicenseSource({ font }: { font: FontRecord }) {
  const notice = licensingNotice(font);
  const details = [
    ["Availability", availabilityLabel(font)],
    ["License", font.licenseName ?? "—"],
    [
      "Commercial use",
      font.canUseCommercially === true
        ? "Yes"
        : font.canUseCommercially === false
          ? "No"
          : font.canUseCommercially === "depends"
            ? "Depends on provider"
            : "Requires license",
    ],
    ["Foundry", font.foundry ?? "—"],
    ["Source", font.sourceName],
  ] as const;
  return (
    <section className="tm-analysis-card tm-license-section">
      <div className="tm-section-heading">
        <div>
          <span className="label-eyebrow">08 — License &amp; source</span>
          <h2 className="mt-3">Licensing &amp; source.</h2>
        </div>
        <p>
          TypeMatch Studio is an informational tool. It does not host or serve font files. Always
          verify the official license with the original source before use.
        </p>
      </div>

      <div className="tm-license-panel">
        <div className="tm-license-summary">
          <span className="label-eyebrow">Selected typeface</span>
          <h3>{font.name}</h3>
          <LicenseBadges font={font} />
          <p>
            Use the source link to confirm current licensing, available weights and permitted
            formats. TypeMatch never redistributes the files.
          </p>
        </div>

        <div className="tm-license-details">
          <dl>
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            <div>
              <dt>Link</dt>
              <dd>
                <a href={font.sourceUrl} target="_blank" rel="noreferrer">
                  {font.sourceUrl.replace(/^https?:\/\//, "")}
                  <ExternalLink size={12} />
                </a>
              </dd>
            </div>
          </dl>
          <a
            href={font.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="tm-license-source-button"
          >
            {sourceButtonLabel(font)} <ExternalLink size={12} />
          </a>
          {notice && <p className="tm-license-notice">{notice}</p>}
        </div>
      </div>
    </section>
  );
}
