"use client";

import { MAX_QTY } from "@/lib/inquiry-items";

/** Minus, a number field and plus, each a thumb-sized target. */
export function QtyStepper({
  value,
  onChange,
  label,
  className = "",
}: {
  value: number;
  onChange: (qty: number) => void;
  label: string;
  className?: string;
}) {
  const button =
    "grid h-10 w-10 place-items-center rounded-lg bg-bg text-lg font-bold text-ink transition-colors hover:bg-accent disabled:opacity-40 disabled:hover:bg-bg";
  return (
    <div role="group" aria-label={label} className={`inline-flex items-center gap-1 ${className}`}>
      <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="One fewer">
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QTY}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Quantity"
        className="h-10 w-16 rounded-lg bg-surface text-center text-base font-semibold text-ink ring-1 ring-inset ring-border [appearance:textfield] focus:outline-none focus:ring-2 focus:ring-accent [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="One more">
        +
      </button>
    </div>
  );
}
