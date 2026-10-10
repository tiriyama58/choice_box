"use client";

import { FormEvent, useState } from "react";

type Props = {
  onAdd: (label: string) => { ok: boolean; error?: "EMPTY" };
  disabled?: boolean;
};

export function ChoiceForm({ onAdd, disabled }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = onAdd(value);
    if (!result.ok) {
      setError("選択肢を入力してください（空白のみは追加できません）。");
      return;
    }
    setValue("");
    setError(null);
  }

  return (
    <form className="choice-form" onSubmit={handleSubmit} noValidate>
      <label className="choice-form__label" htmlFor="choice-input">
        新しい選択肢
      </label>
      <div className="choice-form__row">
        <input
          id="choice-input"
          className="choice-form__input"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) {
              setError(null);
            }
          }}
          placeholder="例: ラーメン"
          disabled={disabled}
          autoComplete="off"
        />
        <button type="submit" className="btn btn--primary" disabled={disabled}>
          追加
        </button>
      </div>
      {error ? (
        <p className="form-error" role="alert">{error}</p>
      ) : null}
    </form>
  );
}
