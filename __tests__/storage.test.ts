import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  localStorageChoicesRepository,
} from "@/lib/storage";
import type { Choice } from "@/types/choice";

const choices: Choice[] = [
  { id: "1", label: "ラーメン", createdAt: 100 },
];

describe("localStorageChoicesRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty array when nothing stored", () => {
    expect(localStorageChoicesRepository.load()).toEqual([]);
  });

  it("round-trips choices", () => {
    localStorageChoicesRepository.save(choices);
    expect(localStorageChoicesRepository.load()).toEqual(choices);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(choices));
  });

  it("returns empty array for invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    expect(localStorageChoicesRepository.load()).toEqual([]);
  });

  it("filters invalid entries", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([choices[0], { id: 1, label: "bad" }]),
    );
    expect(localStorageChoicesRepository.load()).toEqual(choices);
  });
});
