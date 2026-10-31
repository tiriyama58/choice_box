import { describe, expect, it } from "vitest";
import { prependDraw } from "@/lib/history";
import type { DrawRecord } from "@/types/drawRecord";

function record(id: string, drawnAt: number): DrawRecord {
  return {
    id,
    choiceId: `choice-${id}`,
    label: `label-${id}`,
    drawnAt,
  };
}

describe("prependDraw", () => {
  it("prepends onto an empty history", () => {
    const next = record("new", 10);
    expect(prependDraw([], next)).toEqual([next]);
  });

  it("puts the newest record first", () => {
    const older = record("old", 1);
    const newer = record("new", 2);
    expect(prependDraw([older], newer)).toEqual([newer, older]);
  });

  it("drops the oldest record past 20", () => {
    const history = Array.from({ length: 20 }, (_, index) =>
      record(`id-${index}`, index),
    );
    const newest = record("newest", 100);
    const next = prependDraw(history, newest);

    expect(next).toHaveLength(20);
    expect(next[0]).toEqual(newest);
    expect(next.some((item) => item.id === "id-19")).toBe(false);
    expect(next[19]).toEqual(history[18]);
  });

  it("does not mutate the previous history", () => {
    const history = [record("old", 1)];
    const snapshot = history.map((item) => ({ ...item }));
    prependDraw(history, record("new", 2));
    expect(history).toEqual(snapshot);
  });
});
