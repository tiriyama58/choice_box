import { describe, expect, it } from "vitest";
import {
  computeSpinRotation,
  rotationModForWinner,
} from "@/lib/roulette";

describe("rotationModForWinner", () => {
  it("aligns segment center for 4 segments", () => {
    expect(rotationModForWinner(0, 4)).toBe(315);
    expect(rotationModForWinner(1, 4)).toBe(225);
  });
});

describe("computeSpinRotation", () => {
  it("always increases rotation", () => {
    const next = computeSpinRotation(0, 2, 6);
    expect(next).toBeGreaterThan(0);
  });

  it("ends at correct modulo for winner", () => {
    const n = 5;
    const winnerIndex = 3;
    const next = computeSpinRotation(100, winnerIndex, n);
    const targetMod = rotationModForWinner(winnerIndex, n);
    expect(((next % 360) + 360) % 360).toBeCloseTo(targetMod, 5);
  });

  it("adds at least one full turn when already aligned", () => {
    const n = 4;
    const mod = rotationModForWinner(0, n);
    const next = computeSpinRotation(mod, 0, n, 5);
    expect(next - mod).toBeGreaterThanOrEqual(5 * 360);
  });
});
