import type { DrawRecord } from "@/types/drawRecord";

export const HISTORY_STORAGE_KEY = "choicebox:history";

export type HistoryRepository = {
  load: () => DrawRecord[];
  save: (history: DrawRecord[]) => void;
};

function isDrawRecord(value: unknown): value is DrawRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.choiceId === "string" &&
    typeof record.label === "string" &&
    typeof record.drawnAt === "number"
  );
}

function parseHistory(raw: string): DrawRecord[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isDrawRecord);
  } catch {
    console.warn("[ChoiceBox] Failed to parse stored history; resetting.");
    return [];
  }
}

export const localStorageHistoryRepository: HistoryRepository = {
  load(): DrawRecord[] {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw === null) {
        return [];
      }
      return parseHistory(raw);
    } catch {
      return [];
    }
  },

  save(history: DrawRecord[]): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      throw new Error("STORAGE_UNAVAILABLE");
    }
  },
};
