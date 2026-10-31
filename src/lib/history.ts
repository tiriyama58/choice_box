import type { DrawRecord } from "@/types/drawRecord";

export const HISTORY_LIMIT = 20;

export function prependDraw(
  history: DrawRecord[],
  record: DrawRecord,
): DrawRecord[] {
  return [record, ...history].slice(0, HISTORY_LIMIT);
}

export function formatDrawnAt(drawnAt: number): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date(drawnAt));
}
