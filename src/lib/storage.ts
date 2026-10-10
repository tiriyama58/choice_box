import type { Choice } from "@/types/choice";

export const STORAGE_KEY = "choicebox:choices";

export type ChoicesRepository = {
  load: () => Choice[];
  save: (choices: Choice[]) => void;
};

function isChoice(value: unknown): value is Choice {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.label === "string" &&
    typeof record.createdAt === "number"
  );
}

function parseChoices(raw: string): Choice[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isChoice);
  } catch {
    console.warn("[ChoiceBox] Failed to parse stored choices; resetting.");
    return [];
  }
}

export const localStorageChoicesRepository: ChoicesRepository = {
  load(): Choice[] {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return [];
      }
      return parseChoices(raw);
    } catch {
      return [];
    }
  },

  save(choices: Choice[]): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(choices));
    } catch {
      throw new Error("STORAGE_UNAVAILABLE");
    }
  },
};
