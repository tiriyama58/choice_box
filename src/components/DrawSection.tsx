"use client";

import type { Choice } from "@/types/choice";
import { RouletteWheel } from "./RouletteWheel";

type Props = {
  choices: Choice[];
  lastDraw: Choice | null;
  onSpinComplete: (choice: Choice) => void;
};

export function DrawSection({ choices, lastDraw, onSpinComplete }: Props) {
  const canDraw = choices.length > 0;

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
        {lastDraw ? (
          <p className="draw-result__text">
            結果: <strong>{lastDraw.label}</strong>
          </p>
        ) : (
          <p className="draw-result__placeholder">
            ルーレットを回して結果を表示します。
          </p>
        )}
      </div>
    </section>
  );
}
