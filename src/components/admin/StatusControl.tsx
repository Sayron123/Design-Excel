"use client";

import { useOptimistic, useState, useTransition } from "react";
import { updateStatus } from "@/app/admin/actions";
import type { InquiryStatus } from "@/lib/supabase/server";

const STATUSES: { id: InquiryStatus; label: string; on: string }[] = [
  { id: "new", label: "New", on: "bg-accent text-ink" },
  { id: "contacted", label: "Contacted", on: "bg-primary text-white" },
  { id: "done", label: "Done", on: "bg-ink text-white" },
];

/** Three-way status switch for one inquiry. Shows the new status at once and rolls back on failure. */
export function StatusControl({ id, status, company }: { id: string; status: InquiryStatus; company: string }) {
  const [shown, setShown] = useOptimistic(status);
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);

  function choose(next: InquiryStatus) {
    if (next === shown) return;
    setError(false);
    start(async () => {
      setShown(next);
      try {
        await updateStatus(id, next);
      } catch {
        setError(true);
      }
    });
  }

  return (
    <div>
      <div role="group" aria-label={`Status of ${company}`} className={`inline-flex rounded-lg bg-bg p-1 ${pending ? "opacity-80" : ""}`}>
        {STATUSES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={shown === s.id}
            onClick={() => choose(s.id)}
            className={`h-9 rounded-md px-3 text-[14px] font-semibold transition-colors ${
              shown === s.id ? s.on : "text-ink hover:bg-border"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-[13px] font-semibold text-red-700">Not saved. Try again.</p>}
    </div>
  );
}
