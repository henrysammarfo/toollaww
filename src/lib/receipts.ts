import type { Receipt } from "@/lib/kernel";

const KEY = "toollaw.receipts.v1";

export function loadReceipts(): Receipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Receipt[];
  } catch {
    return [];
  }
}

export function saveReceipts(next: Receipt[]): void {
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function prependReceipts(batch: Receipt[]): Receipt[] {
  const merged = [...batch, ...loadReceipts()].slice(0, 80);
  saveReceipts(merged);
  return merged;
}
