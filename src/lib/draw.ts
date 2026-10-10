import type { Choice } from "@/types/choice";

export function pickRandom(choices: Choice[]): Choice | null {
  if (choices.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}
