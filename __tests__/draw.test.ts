import { describe, expect, it, vi } from "vitest";
import { pickRandom } from "@/lib/draw";
import type { Choice } from "@/types/choice";

const sample: Choice[] = [
  { id: "a", label: "A", createdAt: 1 },
  { id: "b", label: "B", createdAt: 2 },
];

describe("pickRandom", () => {
  it("returns null when choices is empty", () => {
    expect(pickRandom([])).toBeNull();
  });

  it("returns an element from the array", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const result = pickRandom(sample);
    expect(result).toEqual(sample[1]);
    vi.restoreAllMocks();
  });

  it("returns the first item when random is 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = pickRandom(sample);
    expect(result).toEqual(sample[0]);
    vi.restoreAllMocks();
  });
});
