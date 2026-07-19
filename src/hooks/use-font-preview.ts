import { useEffect, useMemo, useState } from "react";
import type { FontRecord } from "@/data/fonts";

const FALLBACK_FAMILY = "Inter, ui-sans-serif, system-ui, sans-serif";
export type FontPreviewStatus = "loading" | "ready" | "unavailable";

function primaryFamily(font: FontRecord) {
  return font.family.split(",")[0]?.replace(/["']/g, "").trim() || font.name;
}

function stylesheetUrls(font: FontRecord, family: string) {
  if (font.canPreviewInApp === false) return [];
  const google = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}&display=swap`;
  const fontsource = `https://cdn.jsdelivr.net/fontsource/css/${encodeURIComponent(font.id)}@latest/index.css`;
  return Array.from(
    new Set(font.sourceName === "Google Fonts" ? [google, fontsource] : [fontsource, google]),
  );
}

function loadStylesheet(id: string, url: string) {
  return new Promise<boolean>((resolve) => {
    let link = document.getElementById(id) as HTMLLinkElement | null;
    let finished = false;
    let timeout = 0;
    const finish = (loaded: boolean) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      link?.removeEventListener("load", onLoad);
      link?.removeEventListener("error", onError);
      resolve(loaded);
    };
    const onLoad = () => {
      if (link) link.dataset.previewState = "ready";
      finish(true);
    };
    const onError = () => {
      if (link) link.dataset.previewState = "unavailable";
      finish(false);
    };

    if (link?.dataset.previewState === "ready" || link?.sheet) {
      finish(true);
      return;
    }
    if (link?.dataset.previewState === "unavailable") {
      finish(false);
      return;
    }

    link ??= document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = url;
    link.addEventListener("load", onLoad);
    link.addEventListener("error", onError);
    if (!link.isConnected) document.head.appendChild(link);
    timeout = window.setTimeout(() => finish(false), 8000);
  });
}

export function useFontPreview(font: FontRecord) {
  const familyName = primaryFamily(font);
  const urls = useMemo(() => stylesheetUrls(font, familyName), [familyName, font]);
  const [status, setStatus] = useState<FontPreviewStatus>(() =>
    font.canPreviewInApp === false ? "unavailable" : "loading",
  );

  useEffect(() => {
    let cancelled = false;
    setStatus(font.canPreviewInApp === false ? "unavailable" : "loading");
    if (font.canPreviewInApp === false) {
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
        if (!cancelled) setStatus("ready");
        return;
      }
      for (const [index, url] of urls.entries()) {
        const loaded = await loadStylesheet(`font-preview-${font.id}-${index}`, url);
        if (cancelled) return;
        if (loaded && (await verify())) {
          if (!cancelled) setStatus("ready");
          return;
        }
      }
      if (!cancelled) setStatus("unavailable");
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [familyName, font.canPreviewInApp, font.id, urls]);

  return {
    family: status === "unavailable" ? FALLBACK_FAMILY : font.family,
    available: status === "ready",
    status,
  };
}
