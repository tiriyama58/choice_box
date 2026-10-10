"use client";

import { ChoiceForm } from "./ChoiceForm";
import { ChoiceList } from "./ChoiceList";
import { DrawSection } from "./DrawSection";
import { useChoices } from "@/hooks/useChoices";

export function ChoiceBoxApp() {
  const {
    choices,
    lastDraw,
    loaded,
    storageError,
    addChoice,
    removeChoice,
    commitDraw,
  } = useChoices();

  if (!loaded) {
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

      {storageError ? (
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
        lastDraw={lastDraw}
        onSpinComplete={commitDraw}
      />
    </div>
  );
}
