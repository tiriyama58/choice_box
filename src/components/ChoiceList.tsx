import type { Choice } from "@/types/choice";
import { EmptyState } from "./EmptyState";

type Props = {
  choices: Choice[];
  onRemove: (id: string) => void;
};

export function ChoiceList({ choices, onRemove }: Props) {
  if (choices.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="choice-list" aria-label="登録済みの選択肢">
      {choices.map((choice) => (
        <li key={choice.id} className="choice-list__item">
          <span className="choice-list__label">{choice.label}</span>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => onRemove(choice.id)}
            aria-label={`「${choice.label}」を削除`}
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  );
}
