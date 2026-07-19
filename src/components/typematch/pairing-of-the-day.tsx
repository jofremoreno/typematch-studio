import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PUBLIC_FONTS_BY_ID } from "@/data/fonts";
import { useFontPreview } from "@/hooks/use-font-preview";

const DAILY_PAIRINGS = [
  {
    primaryId: "abril-fatface",
    secondaryId: "inter",
    title: "Ideas need room to breathe.",
    body: "A characterful display voice meets a neutral reading rhythm — expressive enough to lead, disciplined enough to build a clear system.",
    image:
      "https://images.unsplash.com/photo-1562151270-c7d22ceb586a?auto=format&fit=crop&fm=jpg&q=86&w=1600",
    alt: "A person in a flowing yellow dress beneath a vivid blue sky",
    position: "center 62%",
    contrast: "dark",
  },
  {
    primaryId: "space-grotesk",
    secondaryId: "cormorant-garamond",
    title: "Contrast creates a point of view.",
    body: "A precise grotesk gives structure while an editorial serif introduces pace, texture and a quieter supporting voice.",
    image:
      "https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?auto=format&fit=crop&fm=jpg&q=86&w=1600",
    alt: "An editorial portrait in a deep red suit",
    position: "center 40%",
    contrast: "light",
  },
  {
    primaryId: "fraunces",
    secondaryId: "dm-sans",
    title: "Form follows feeling.",
    body: "Soft, expressive shapes establish the mood. A restrained sans-serif carries the detail with clarity across longer passages.",
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&fm=jpg&q=86&w=1600",
    alt: "A vivid abstract composition of color and suspended bubbles",
    position: "center",
    contrast: "dark",
  },
  {
    primaryId: "playfair-display",
    secondaryId: "manrope",
    title: "A classic voice, made current.",
    body: "High-contrast letterforms bring authority to the headline while a contemporary sans-serif keeps navigation and body copy direct.",
    image:
      "https://images.unsplash.com/photo-1594902483580-4bf0f4df41d9?auto=format&fit=crop&fm=jpg&q=86&w=1600",
    alt: "Blue glass vessels arranged with lemons and oranges",
    position: "center 58%",
    contrast: "dark",
  },
  {
    primaryId: "source-serif-4",
    secondaryId: "space-grotesk",
    title: "Reading begins with rhythm.",
    body: "A literary serif creates continuity for the eye. The geometric secondary voice adds contrast where hierarchy needs to become immediate.",
    image:
      "https://images.unsplash.com/photo-1771317778033-3473a576c5e9?auto=format&fit=crop&fm=jpg&q=86&w=1600",
    alt: "A curved turquoise pool surrounded by tropical plants and red flowers",
    position: "center 54%",
    contrast: "dark",
  },
] as const;

function dailyIndex() {
  const now = new Date();
  const utcDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor(utcDay / 86_400_000) % DAILY_PAIRINGS.length;
}

export function PairingOfTheDay() {
  const index = dailyIndex();
  const pairing = DAILY_PAIRINGS[index];
  const primary = PUBLIC_FONTS_BY_ID[pairing.primaryId];
  const secondary = PUBLIC_FONTS_BY_ID[pairing.secondaryId];
  const primaryPreview = useFontPreview(primary);
  const secondaryPreview = useFontPreview(secondary);

  return (
    <Link
      to="/analyze"
      search={{ font: primary.id, with: secondary.id } as never}
      className="tm-daily-pairing"
      data-contrast={pairing.contrast}
      aria-label={`View the pairing ${primary.name} with ${secondary.name}`}
    >
      <div className="tm-daily-pairing-image-wrap">
        <img
          src={pairing.image}
          alt={pairing.alt}
          className="tm-daily-pairing-image"
          style={{ objectPosition: pairing.position }}
          loading="eager"
          decoding="async"
        />
        <div className="tm-daily-pairing-image-shade" aria-hidden="true" />
        <div className="tm-daily-pairing-topline">
          <span className="tm-daily-pairing-count" aria-label={`Pairing ${index + 1} of 5`}>
            {String(index + 1).padStart(2, "0")} / {String(DAILY_PAIRINGS.length).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="tm-daily-pairing-label">Pairing of the day</span>

      <div className="tm-daily-pairing-content">
        <div className="tm-daily-pairing-copy">
          <div className="tm-daily-pairing-primary">
            <h2 style={{ fontFamily: primaryPreview.family }}>{pairing.title}</h2>
          </div>
          <div className="tm-daily-pairing-secondary">
            <p style={{ fontFamily: secondaryPreview.family }}>{pairing.body}</p>
          </div>
        </div>

        <div className="tm-daily-pairing-link">
          <span className="tm-daily-pairing-fonts">
            <span style={{ fontFamily: primaryPreview.family }}>{primary.name}</span>
            <i aria-hidden="true">+</i>
            <span style={{ fontFamily: secondaryPreview.family }}>{secondary.name}</span>
          </span>
          <span className="tm-daily-pairing-view">
            View pairing
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
