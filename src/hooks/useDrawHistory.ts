"use client";

import { useCallback, useEffect, useState } from "react";
import { prependDraw } from "@/lib/history";
import {
  localStorageHistoryRepository,
  type HistoryRepository,
} from "@/lib/historyStorage";
import type { Choice } from "@/types/choice";
import type { DrawRecord } from "@/types/drawRecord";

const repository: HistoryRepository = localStorageHistoryRepository;

function persistHistory(history: DrawRecord[]): boolean {
  try {
    repository.save(history);
    return true;
  } catch {
    return false;
  }
}

export function useDrawHistory() {
  const [history, setHistory] = useState<DrawRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const stored = repository.load();
    // Client-only hydration from localStorage (single mount).
    /* eslint-disable react-hooks/set-state-in-effect -- intentional one-time load */
    setHistory(stored);
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const appendDraw = useCallback((choice: Choice) => {
    const record: DrawRecord = {
      id: crypto.randomUUID(),
      label: choice.label,
      choiceId: choice.id,
      drawnAt: Date.now(),
    };
    setHistory((prev) => {
      const next = prependDraw(prev, record);
      setStorageError(!persistHistory(next));
      return next;
    });
  }, []);

  return {
    history,
    loaded,
    storageError,
    appendDraw,
  };
}
