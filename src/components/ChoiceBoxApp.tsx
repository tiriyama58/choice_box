"use client";

import { useCallback } from "react";
import { ChoiceForm } from "./ChoiceForm";
import { ChoiceList } from "./ChoiceList";
import { DrawSection } from "./DrawSection";
import { useChoices } from "@/hooks/useChoices";
import { useDrawHistory } from "@/hooks/useDrawHistory";
import type { Choice } from "@/types/choice";

export function ChoiceBoxApp() {
  const {
    choices,
    loaded,
    storageError,
    addChoice,
    removeChoice,
    commitDraw,
  } = useChoices();
  const {
    history,
    loaded: historyLoaded,
    storageError: historyStorageError,
    appendDraw,
  } = useDrawHistory();

  const handleSpinComplete = useCallback((choice: Choice) => {
    commitDraw(choice);
    appendDraw(choice);
  }, [appendDraw, commitDraw]);

  if (!loaded || !historyLoaded) {
    return (
      <div className="app-shell">
        <p className="loading" role="status">読み込み中…</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">ChoiceBox</h1>
        <p className="app-lead">
          登録した選択肢から、ランダムに1つを選びます。
        </p>
      </header>

      {storageError || historyStorageError ? (
        <p className="storage-error" role="alert">
          選択肢を保存できませんでした。ブラウザの設定やプライベートモードをご確認ください。
        </p>
      ) : null}

      <ChoiceForm onAdd={addChoice} />

      <section className="choices-section" aria-labelledby="choices-heading">
        <h2 id="choices-heading" className="section-heading">
          選択肢一覧（{choices.length}件）
        </h2>
        <ChoiceList choices={choices} onRemove={removeChoice} />
      </section>

      <DrawSection
        choices={choices}
        history={history}
        onSpinComplete={handleSpinComplete}
      />
    </div>
  );
}
