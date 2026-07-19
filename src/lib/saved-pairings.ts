import { useEffect, useState, useCallback } from "react";
import type { Pairing } from "./pairing";

const STORAGE_KEY = "typematch:saved-pairings:v1";
const EVENT = "typematch:saved-pairings-changed";
const SAVED_MAX = 100;

export interface SavedPairing {
  id: string; // primary.id + "__" + secondary.id
  primaryId: string;
  primaryName: string;
  secondaryId: string;
  secondaryName: string;
  category: Pairing["category"];
  riskLevel: Pairing["riskLevel"];
  confidence: number;
  shortExplanation: string;
  savedAt: number;
}

function isSavedPairing(value: unknown): value is SavedPairing {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<SavedPairing>;
  return (
    typeof item.id === "string" &&
    typeof item.primaryId === "string" &&
    typeof item.primaryName === "string" &&
    typeof item.secondaryId === "string" &&
    typeof item.secondaryName === "string" &&
    typeof item.category === "string" &&
    typeof item.riskLevel === "string" &&
    typeof item.confidence === "number" &&
    Number.isFinite(item.confidence) &&
    typeof item.shortExplanation === "string" &&
    typeof item.savedAt === "number" &&
    Number.isFinite(item.savedAt)
  );
}

function pairingId(p: Pairing) {
  return `${p.primary.id}__${p.secondary.id}`;
}

function readAll(): SavedPairing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSavedPairing).slice(0, SAVED_MAX) : [];
  } catch {
    return [];
  }
}

function writeAll(items: SavedPairing[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, SAVED_MAX)));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Saved pairings are optional; the analysis tools remain available without storage.
  }
}

function shorten(text: string, max = 220) {
  const clean = text.replace(/\s*⚠.*$/, "").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

export function useSavedPairings() {
  const [items, setItems] = useState<SavedPairing[]>([]);

  useEffect(() => {
    setItems(readAll());
    const onChange = () => setItems(readAll());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const save = useCallback((p: Pairing) => {
    const id = pairingId(p);
    const current = readAll();
    if (current.some((x) => x.id === id)) return;
    const entry: SavedPairing = {
      id,
      primaryId: p.primary.id,
      primaryName: p.primary.name,
      secondaryId: p.secondary.id,
      secondaryName: p.secondary.name,
      category: p.category,
      riskLevel: p.riskLevel,
      confidence: p.confidence,
      shortExplanation: shorten(p.explanation),
      savedAt: Date.now(),
    };
    writeAll([entry, ...current].slice(0, SAVED_MAX));
  }, []);

  const remove = useCallback((id: string) => {
    writeAll(readAll().filter((x) => x.id !== id));
  }, []);

  const isSaved = useCallback((p: Pairing) => items.some((x) => x.id === pairingId(p)), [items]);

  return { items, save, remove, isSaved };
}

export { pairingId };
