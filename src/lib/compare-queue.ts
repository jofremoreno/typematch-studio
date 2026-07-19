import { useCallback, useEffect, useState } from "react";
import type { FontRecord } from "@/data/fonts";

const STORAGE_KEY = "typematch:compare-queue:v1";
const EVENT = "typematch:compare-queue-changed";
export const COMPARE_MAX = 4;

export interface CompareItem {
  id: string;
  name: string;
  addedAt: number;
}

function isCompareItem(value: unknown): value is CompareItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CompareItem>;
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    typeof item.addedAt === "number" &&
    Number.isFinite(item.addedAt)
  );
}

function readAll(): CompareItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCompareItem).slice(0, COMPARE_MAX) : [];
  } catch {
    return [];
  }
}

function writeAll(items: CompareItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, COMPARE_MAX)));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Comparison remains usable for the current page when storage is unavailable.
  }
}

export function useCompareQueue() {
  const [items, setItems] = useState<CompareItem[]>([]);

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

  const add = useCallback((f: Pick<FontRecord, "id" | "name">) => {
    const current = readAll();
    if (current.some((x) => x.id === f.id)) return;
    if (current.length >= COMPARE_MAX) return;
    writeAll([...current, { id: f.id, name: f.name, addedAt: Date.now() }]);
  }, []);

  const remove = useCallback((id: string) => {
    writeAll(readAll().filter((x) => x.id !== id));
  }, []);

  const toggle = useCallback((f: Pick<FontRecord, "id" | "name">) => {
    const current = readAll();
    if (current.some((x) => x.id === f.id)) {
      writeAll(current.filter((x) => x.id !== f.id));
    } else if (current.length < COMPARE_MAX) {
      writeAll([...current, { id: f.id, name: f.name, addedAt: Date.now() }]);
    }
  }, []);

  const clear = useCallback(() => writeAll([]), []);
  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);

  return { items, count: items.length, add, remove, toggle, clear, has };
}
