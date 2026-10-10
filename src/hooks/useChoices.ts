"use client";

import { useCallback, useEffect, useState } from "react";
import {
  localStorageChoicesRepository,
  type ChoicesRepository,
} from "@/lib/storage";
import type { Choice } from "@/types/choice";

const repository: ChoicesRepository = localStorageChoicesRepository;

function persistChoices(choices: Choice[]): boolean {
  try {
    repository.save(choices);
    return true;
  } catch {
    return false;
  }
}

export function useChoices() {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [lastDraw, setLastDraw] = useState<Choice | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const stored = repository.load();
    // Client-only hydration from localStorage (single mount).
    /* eslint-disable react-hooks/set-state-in-effect -- intentional one-time load */
    setChoices(stored);
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const addChoice = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) {
      return { ok: false as const, error: "EMPTY" as const };
    }
    const choice: Choice = {
      id: crypto.randomUUID(),
      label: trimmed,
      createdAt: Date.now(),
    };
    setChoices((prev) => {
      const next = [...prev, choice];
      setStorageError(!persistChoices(next));
      return next;
    });
    return { ok: true as const };
  }, []);

  const removeChoice = useCallback((id: string) => {
    setChoices((prev) => {
      const next = prev.filter((c) => c.id !== id);
      setStorageError(!persistChoices(next));
      return next;
    });
    setLastDraw((prev) => (prev?.id === id ? null : prev));
  }, []);

  const commitDraw = useCallback((choice: Choice) => {
    setLastDraw(choice);
  }, []);

  return {
    choices,
    lastDraw,
    loaded,
    storageError,
    addChoice,
    removeChoice,
    commitDraw,
  };
}
