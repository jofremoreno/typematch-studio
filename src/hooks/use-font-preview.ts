import { useEffect, useMemo, useState } from "react";
import type { FontRecord } from "@/data/fonts";

const FALLBACK_FAMILY = "Inter, ui-sans-serif, system-ui, sans-serif";
const STATIC_SOURCES = new Set([
  "Fontshare",
  "Official repository",
  "Collletttivo",
  "Velvetyne",
  "The League of Moveable Type",
  "Font Squirrel",
]);

function primaryFamily(font: FontRecord) {
  return font.family.split(",")[0]?.replace(/["']/g, "").trim() || font.name;
}

function stylesheetUrls(font: FontRecord, family: string) {
  if (font.canPreviewInApp === false || STATIC_SOURCES.has(font.sourceName)) return [];
  const google = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}&display=swap`;
  const fontsource = `https://cdn.jsdelivr.net/fontsource/css/${encodeURIComponent(font.id)}@latest/index.min.css`;
  return font.sourceName === "Google Fonts" ? [google, fontsource] : [fontsource, google];
}

function loadStylesheet(id: string, url: string) {
  return new Promise<void>((resolve) => {
    const existing = document.getElementById(id) as HTMLLinkElement | null;
    if (existing?.sheet) {
      resolve();
      return;
    }

    const link = existing ?? document.createElement("link");
    const finish = () => resolve();
    link.id = id;
    link.rel = "stylesheet";
    link.href = url;
    link.addEventListener("load", finish, { once: true });
    link.addEventListener("error", finish, { once: true });
    if (!existing) document.head.appendChild(link);
    window.setTimeout(finish, 5000);
  });
}

export function useFontPreview(font: FontRecord) {
  const familyName = primaryFamily(font);
  const urls = useMemo(() => stylesheetUrls(font, familyName), [familyName, font]);
  const [available, setAvailable] = useState(font.canPreviewInApp !== false);

  useEffect(() => {
    let cancelled = false;
    if (font.canPreviewInApp === false) {
      setAvailable(false);
      return;
    }

    const verify = async () => {
      try {
        const faces = await document.fonts.load(`400 48px "${familyName}"`);
        return faces.length > 0;
      } catch {
        return false;
      }
    };

    const run = async () => {
      if (await verify()) {
        if (!cancelled) setAvailable(true);
        return;
      }
      for (const [index, url] of urls.entries()) {
        await loadStylesheet(`font-detail-${font.id}-${index}`, url);
        if (await verify()) {
          if (!cancelled) setAvailable(true);
          return;
        }
      }
      if (!cancelled) setAvailable(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [familyName, font.canPreviewInApp, font.id, urls]);

  return {
    family: available ? font.family : FALLBACK_FAMILY,
    available,
  };
}
