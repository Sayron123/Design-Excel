"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, buttonClass } from "@/components/ui/button";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { addToInquiry, useInquiryCount } from "@/lib/inquiry-cart";
import { INQUIRE_HREF } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

/** "Add to inquiry" for a product category: an optional model, a quantity and the button. */
export function AddToInquiry({ name, href, models }: { name: string; href: string; models?: string[] }) {
  const [qty, setQty] = useState(1);
  const [model, setModel] = useState("");
  const [added, setAdded] = useState<string | null>(null);
  const count = useInquiryCount();
  const selectId = useId();

  function add() {
    const ok = addToInquiry({ kind: "product", name, detail: model ? `Model ${model}` : undefined, qty, href });
    setAdded(ok ? `${qty} × ${name}${model ? ` ${model}` : ""}` : "full");
    setQty(1);
  }

  return (
    <div className="mt-8 rounded-xl bg-surface p-5">
      {models && models.length > 0 && (
        <div className="mb-4">
          <label htmlFor={selectId} className="block text-base font-semibold text-ink">
            Model
          </label>
          <select
            id={selectId}
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl bg-bg px-4 text-base text-ink ring-1 ring-inset ring-border focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Not sure yet, advise me</option>
            {models.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, Math.min(999, Math.round(v) || 1)))} label="Quantity" />
        <button type="button" onClick={add} className={buttonClass("accent", "md", "flex-1 sm:flex-none")}>
          Add to inquiry
        </button>
      </div>
      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {added && (
            <motion.p
              key={added + count}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-ink"
            >
              <span>{added === "full" ? "Your inquiry is full. Send it, then start another." : `Added ${added}. ${count} in your inquiry.`}</span>
              <Link href={INQUIRE_HREF} className="inline-flex items-center gap-1 font-semibold underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-ink">
                View inquiry
                <ArrowRight />
              </Link>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** A small add button under one model in the model grid. */
export function AddModelButton({ code, type, href }: { code: string; type: string; href: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        addToInquiry({ kind: "product", name: type, detail: `Model ${code}`, qty: 1, href });
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
      aria-label={`Add ${code} to inquiry`}
      className={buttonClass("soft", "sm", "mt-2 h-9 px-3")}
    >
      {done ? "Added" : "+ Add"}
    </button>
  );
}
