"use client";

import { useCallback, useRef, useState } from "react";
import { computeSpinRotation } from "@/lib/roulette";
import { pickRandom } from "@/lib/draw";
import type { Choice } from "@/types/choice";

const SPIN_DURATION_S = 4.5;
const WHEEL_SIZE = 280;
const CX = WHEEL_SIZE / 2;
const CY = WHEEL_SIZE / 2;
const R = WHEEL_SIZE / 2 - 4;

const SEGMENT_COLORS = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#ca8a04",
  "#db2777",
];

type Props = {
  choices: Choice[];
  onSpinComplete: (choice: Choice) => void;
  disabled?: boolean;
};

function truncateLabel(label: string, maxLen: number): string {
  if (label.length <= maxLen) {
    return label;
  }
  return `${label.slice(0, maxLen - 1)}…`;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function segmentPath(
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(CX, CY, R, startAngle);
  const end = polarToCartesian(CX, CY, R, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${CX} ${CY}`,
    `L ${start.x} ${start.y}`,
    `A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export function RouletteWheel({ choices, onSpinComplete, disabled }: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const rotationRef = useRef(0);
  const pendingWinnerRef = useRef<Choice | null>(null);

  const canSpin = choices.length > 0 && !spinning && !disabled;

  const finishSpin = useCallback(() => {
    const winner = pendingWinnerRef.current;
    pendingWinnerRef.current = null;
    setSpinning(false);
    setTransitionEnabled(false);
    if (winner) {
      onSpinComplete(winner);
    }
  }, [onSpinComplete]);

  const handleSpin = useCallback(() => {
    if (!canSpin) {
      return;
    }
    const winner = pickRandom(choices);
    if (!winner) {
      return;
    }
    const winnerIndex = choices.findIndex((c) => c.id === winner.id);
    if (winnerIndex < 0) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    pendingWinnerRef.current = winner;

    if (prefersReducedMotion) {
      const target = computeSpinRotation(
        rotationRef.current,
        winnerIndex,
        choices.length,
        0,
      );
      rotationRef.current = target;
      setRotation(target);
      finishSpin();
      return;
    }

    const target = computeSpinRotation(
      rotationRef.current,
      winnerIndex,
      choices.length,
    );
    rotationRef.current = target;
    setSpinning(true);
    setTransitionEnabled(true);
    requestAnimationFrame(() => {
      setRotation(target);
    });
  }, [canSpin, choices, finishSpin]);

  const n = choices.length;
  const segmentAngle = n > 0 ? 360 / n : 360;
  const labelMax =
    n <= 4 ? 10 : n <= 8 ? 6 : n <= 12 ? 4 : 3;

  return (
    <div className="roulette">
      <div className="roulette__frame" aria-hidden={n === 0}>
        <div
          className="roulette__pointer"
          aria-hidden="true"
        />
        <div
          className="roulette__wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: transitionEnabled
              ? `transform ${SPIN_DURATION_S}s cubic-bezier(0.12, 0.8, 0.12, 1)`
              : "none",
          }}
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform" && spinning) {
              finishSpin();
            }
          }}
        >
          <svg
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            role="img"
            aria-label="ルーレット"
          >
            {n === 0 ? (
              <circle
                cx={CX}
                cy={CY}
                r={R}
                className="roulette__empty"
              />
            ) : (
              choices.map((choice, i) => {
                const start = i * segmentAngle;
                const end = (i + 1) * segmentAngle;
                const mid = start + segmentAngle / 2;
                const labelPos = polarToCartesian(CX, CY, R * 0.62, mid);
                return (
                  <g key={choice.id}>
                    <path
                      d={segmentPath(start, end)}
                      fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                      stroke="var(--surface)"
                      strokeWidth={2}
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      fill="#fff"
                      fontSize={n > 10 ? 9 : 11}
                      fontWeight={600}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                    >
                      {truncateLabel(choice.label, labelMax)}
                    </text>
                  </g>
                );
              })
            )}
            <circle
              cx={CX}
              cy={CY}
              r={R * 0.12}
              fill="var(--surface)"
              stroke="var(--border)"
              strokeWidth={2}
            />
          </svg>
        </div>
      </div>

      <button
        type="button"
        className="btn btn--accent roulette__spin-btn"
        onClick={handleSpin}
        disabled={!canSpin}
        aria-describedby={canSpin ? undefined : "draw-hint"}
      >
        {spinning ? "回転中…" : "ルーレットを回す"}
      </button>
    </div>
  );
}
