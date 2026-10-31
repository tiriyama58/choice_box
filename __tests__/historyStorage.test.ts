import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HISTORY_STORAGE_KEY, localStorageHistoryRepository } from "@/lib/historyStorage";
import { STORAGE_KEY } from "@/lib/storage";
import type { DrawRecord } from "@/types/drawRecord";

const history: DrawRecord[] = [
  { id: "h1", choiceId: "c1", label: "ラーメン", drawnAt: 100 },
];

const storedChoices = JSON.stringify([
  { id: "c1", label: "ラーメン", createdAt: 1 },
]);

describe("localStorageHistoryRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an empty array when nothing is stored", () => {
    expect(localStorageHistoryRepository.load()).toEqual([]);
  });

  it("round-trips history without touching choices", () => {
    localStorage.setItem(STORAGE_KEY, storedChoices);
    localStorageHistoryRepository.save(history);

    expect(localStorageHistoryRepository.load()).toEqual(history);
    expect(localStorage.getItem(HISTORY_STORAGE_KEY)).toBe(JSON.stringify(history));
    expect(localStorage.getItem(STORAGE_KEY)).toBe(storedChoices);
  });

  it("returns an empty array for invalid JSON", () => {
    localStorage.setItem(HISTORY_STORAGE_KEY, "not-json");
    expect(localStorageHistoryRepository.load()).toEqual([]);
  });

  it("filters invalid entries", () => {
    localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify([history[0], { id: 1, label: "bad" }]),
    );
    expect(localStorageHistoryRepository.load()).toEqual(history);
  });

  it("returns an empty array when window is undefined", () => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    vi.stubGlobal("window", undefined);

    expect(localStorageHistoryRepository.load()).toEqual([]);
    expect(() => localStorageHistoryRepository.save(history)).not.toThrow();
  });
});
