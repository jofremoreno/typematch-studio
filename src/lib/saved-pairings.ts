import { useEffect, useState, useCallback } from "react";
import type { Pairing } from "./pairing";

const STORAGE_KEY = "typematch:saved-pairings:v1";
const EVENT = "typematch:saved-pairings-changed";

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

function pairingId(p: Pairing) {
  return `${p.primary.id}__${p.secondary.id}`;
}

function readAll(): SavedPairing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedPairing[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: SavedPairing[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
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
    writeAll([entry, ...current]);
  }, []);

  const remove = useCallback((id: string) => {
    writeAll(readAll().filter((x) => x.id !== id));
  }, []);

  const isSaved = useCallback((p: Pairing) => items.some((x) => x.id === pairingId(p)), [items]);

  return { items, save, remove, isSaved };
}

export { pairingId };
