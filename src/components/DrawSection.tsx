"use client";

import { formatDrawnAt } from "@/lib/history";
import type { Choice } from "@/types/choice";
import type { DrawRecord } from "@/types/drawRecord";
import { RouletteWheel } from "./RouletteWheel";

type Props = {
  choices: Choice[];
  history: DrawRecord[];
  onSpinComplete: (choice: Choice) => void;
};

export function DrawSection({ choices, history, onSpinComplete }: Props) {
  const canDraw = choices.length > 0;
  const latest = history[0] ?? null;

  return (
    <section className="draw-section" aria-labelledby="draw-heading">
      <h2 id="draw-heading" className="section-heading">抽選</h2>

      <RouletteWheel
        choices={choices}
        onSpinComplete={onSpinComplete}
      />

      {!canDraw ? (
        <p id="draw-hint" className="draw-hint">
          選択肢を1件以上追加するとルーレットを回せます。
        </p>
      ) : null}

      <div className="draw-result" aria-live="polite" aria-atomic="true">
        {latest ? (
          <p className="draw-result__text">
            結果: <strong>{latest.label}</strong>{" "}
            <time dateTime={new Date(latest.drawnAt).toISOString()}>
              {formatDrawnAt(latest.drawnAt)}
            </time>
          </p>
        ) : (
          <p className="draw-result__placeholder">
            ルーレットを回して結果を表示します。
          </p>
        )}
      </div>

      <section className="history-section" aria-labelledby="history-heading">
        <h2 id="history-heading" className="section-heading">抽選履歴</h2>
        {history.length === 0 ? (
          <p className="history-empty">抽選履歴はまだありません。</p>
        ) : (
          <ol className="history-list" aria-label="抽選履歴">
            {history.map((record) => (
              <li key={record.id} className="history-list__item">
                <span className="history-list__label">{record.label}</span>
                <time dateTime={new Date(record.drawnAt).toISOString()}>
                  {formatDrawnAt(record.drawnAt)}
                </time>
              </li>
            ))}
          </ol>
        )}
      </section>
    </section>
  );
}
