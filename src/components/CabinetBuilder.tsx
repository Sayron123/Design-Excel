"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { CabinetElevation } from "@/components/CabinetElevation";
import { ArrowLeft, ArrowRight, buttonClass } from "@/components/ui/button";
import {
  CABINET_TYPES,
  COUNTERTOPS,
  FINISHES,
  clampWidth,
  getCabinetType,
  type CabinetTypeId,
  type Swatch,
} from "@/lib/builder";
import { addToInquiry, useInquiryCount } from "@/lib/inquiry-cart";
import { BUILDER_HREF, INQUIRE_HREF } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

type StepId = "type" | "finish" | "counter" | "size";
const STEP_LABEL: Record<StepId, string> = { type: "Type", finish: "Finish", counter: "Countertop", size: "Width" };
const NOTES_MAX = 300;

const tile = (selected: boolean) =>
  `block cursor-pointer rounded-xl p-3 transition-[background-color,box-shadow] duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${
    selected ? "bg-surface ring-2 ring-inset ring-primary" : "bg-surface ring-1 ring-inset ring-border hover:ring-primary/40"
  }`;

function SwatchPicker({
  legend,
  name,
  swatches,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  swatches: Swatch[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-2xl font-bold tracking-tight">{legend}</legend>
      <p className="mt-2 text-base text-ink">Names are placeholders until the client confirms its range.</p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {swatches.map((s) => (
          <label key={s.id} className={tile(value === s.id)}>
            <input type="radio" name={name} value={s.id} checked={value === s.id} onChange={() => onChange(s.id)} className="sr-only" />
            <span className="block h-14 rounded-lg ring-1 ring-inset ring-ink/10" style={{ background: s.color }} />
            <span className="mt-2 block text-base font-semibold leading-tight text-ink">{s.name}</span>
            <span className="block text-[13px] text-muted">Placeholder</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * The cabinet builder: type, finish, countertop (kitchens only) and width, with a drawing that
 * follows every choice. The result goes into the same inquiry list as the products.
 */
export function CabinetBuilder() {
  const reduce = useReducedMotion();
  const [typeId, setTypeId] = useState<CabinetTypeId>("kitchen");
  const [finishId, setFinishId] = useState(FINISHES[1].id);
  const [counterId, setCounterId] = useState(COUNTERTOPS[0].id);
  const [width, setWidth] = useState(CABINET_TYPES[0].start);
  const [widthText, setWidthText] = useState(CABINET_TYPES[0].start.toFixed(1));
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<StepId>("type");
  const [reached, setReached] = useState(0);
  const [added, setAdded] = useState<string | null>(null);
  const count = useInquiryCount();
  const stepsRef = useRef<HTMLDivElement>(null);

  const type = getCabinetType(typeId) ?? CABINET_TYPES[0];
  const finish = FINISHES.find((f) => f.id === finishId) ?? FINISHES[0];
  const counter = COUNTERTOPS.find((c) => c.id === counterId) ?? COUNTERTOPS[0];
  const steps: StepId[] = typeId === "kitchen" ? ["type", "finish", "counter", "size"] : ["type", "finish", "size"];
  const index = steps.indexOf(step);
  const last = index === steps.length - 1;

  const summary = [
    `Finish: ${finish.name} (placeholder)`,
    typeId === "kitchen" && `Countertop: ${counter.name} (placeholder)`,
    notes.trim() && `Notes: ${notes.trim().replace(/\s+/g, " ")}`,
  ]
    .filter(Boolean)
    .join(" · ");
  const itemName = `${type.name}, ${width.toFixed(1)} m`;

  function chooseType(id: CabinetTypeId) {
    const next = getCabinetType(id);
    if (!next) return;
    setTypeId(id);
    setWidth(next.start);
    setWidthText(next.start.toFixed(1));
  }

  function setWidthFrom(value: number) {
    const w = clampWidth(type, value);
    setWidth(w);
    setWidthText(w.toFixed(1));
  }

  function go(to: number) {
    const target = steps[Math.max(0, Math.min(steps.length - 1, to))];
    setStep(target);
    setReached((r) => Math.max(r, steps.indexOf(target)));
    // On a phone the step panel sits under the drawing; bring its top back into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      stepsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  function add() {
    const ok = addToInquiry({ kind: "builder", name: itemName, detail: summary, qty: 1, href: BUILDER_HREF });
    setAdded(ok ? itemName : "full");
  }

  function startOver() {
    setAdded(null);
    setNotes("");
    setStep("type");
    setReached(0);
  }

  const elevationLabel = `Front view of a ${type.name.toLowerCase()}, ${width.toFixed(1)} metres wide, in ${finish.name.toLowerCase()}${
    typeId === "kitchen" ? ` with a ${counter.name.toLowerCase()} countertop` : ""
  }.`;

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
      {/* The drawing stays in view while the choices scroll: pinned beside them on desktop, under the bar on a phone. */}
      <div className="sticky top-16 z-10 -mx-4 bg-bg px-4 pb-3 pt-2 md:top-20 lg:top-28 lg:col-span-7 lg:mx-0 lg:self-start lg:px-0 lg:pb-0 lg:pt-0">
        <figure data-ui className="rounded-xl bg-surface p-3 md:p-6">
          <CabinetElevation type={typeId} width={width} finish={finish.color} counter={counter.color} label={elevationLabel} />
          <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 md:mt-4">
            <span className="font-heading text-lg font-bold tracking-tight text-ink md:text-2xl">{itemName}</span>
            <span className="text-[14px] text-muted">
              {finish.name}
              {typeId === "kitchen" && ` · ${counter.name}`}
            </span>
          </figcaption>
        </figure>
      </div>

      <div ref={stepsRef} className="scroll-mt-[calc(8rem+50vw)] lg:col-span-5 lg:scroll-mt-28">
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.div
              key="added"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="rounded-2xl bg-primary p-6 text-white md:p-8"
              role="status"
            >
              {added === "full" ? (
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Your inquiry is full</h2>
              ) : (
                <>
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Added to your inquiry</h2>
                  <p className="mt-3 text-lg leading-relaxed text-white/90">
                    {added}. {count} {count === 1 ? "item" : "items"} in your inquiry so far.
                  </p>
                </>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={INQUIRE_HREF} className={buttonClass("accent", "md")}>
                  View inquiry
                  <ArrowRight />
                </Link>
                <button type="button" onClick={startOver} className={buttonClass("glass", "md")}>
                  Build another
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <nav aria-label="Builder steps">
                <ol className="flex flex-wrap gap-2">
                  {steps.map((s, i) => {
                    const current = s === step;
                    const open = i <= reached;
                    return (
                      <li key={s}>
                        <button
                          type="button"
                          disabled={!open}
                          aria-current={current ? "step" : undefined}
                          onClick={() => go(i)}
                          className={`h-10 rounded-lg px-3.5 text-[14px] font-semibold transition-colors ${
                            current ? "bg-primary text-white" : open ? "bg-primary/10 text-primary hover:bg-accent hover:text-ink" : "bg-border/60 text-muted"
                          }`}
                        >
                          {STEP_LABEL[s]}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div className="mt-6 min-h-[22rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    {step === "type" && (
                      <fieldset>
                        <legend className="text-2xl font-bold tracking-tight">What are we building?</legend>
                        <div className="mt-5 space-y-2">
                          {CABINET_TYPES.map((t) => (
                            <label key={t.id} className={tile(typeId === t.id)}>
                              <input
                                type="radio"
                                name="cabinet-type"
                                value={t.id}
                                checked={typeId === t.id}
                                onChange={() => chooseType(t.id)}
                                className="sr-only"
                              />
                              <span className="block px-1 text-lg font-bold tracking-tight text-ink">{t.name}</span>
                              <span className="block px-1 text-base leading-snug text-ink">{t.summary}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    {step === "finish" && (
                      <SwatchPicker legend="Cabinet finish" name="finish" swatches={FINISHES} value={finishId} onChange={setFinishId} />
                    )}

                    {step === "counter" && (
                      <SwatchPicker legend="Quartz countertop" name="countertop" swatches={COUNTERTOPS} value={counterId} onChange={setCounterId} />
                    )}

                    {step === "size" && (
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Width and notes</h2>
                        <label htmlFor="builder-width" className="mt-5 block text-base font-semibold text-ink">
                          Width of the wall, in metres
                        </label>
                        <p id="builder-width-hint" className="mt-1 text-[14px] text-muted">
                          {type.min.toFixed(1)} to {type.max.toFixed(1)} m. We measure on site before anything is made.
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <input
                            type="range"
                            min={type.min}
                            max={type.max}
                            step={0.1}
                            value={width}
                            onChange={(e) => setWidthFrom(Number(e.target.value))}
                            aria-label="Width in metres"
                            aria-valuetext={`${width.toFixed(1)} metres`}
                            className="h-10 flex-1 cursor-pointer accent-primary"
                          />
                          <div className="relative">
                            <input
                              id="builder-width"
                              type="number"
                              inputMode="decimal"
                              min={type.min}
                              max={type.max}
                              step={0.1}
                              value={widthText}
                              onChange={(e) => {
                                setWidthText(e.target.value);
                                const v = Number(e.target.value);
                                if (v >= type.min && v <= type.max) setWidth(Math.round(v * 10) / 10);
                              }}
                              onBlur={() => setWidthFrom(Number(widthText) || type.start)}
                              aria-describedby="builder-width-hint"
                              className="h-12 w-24 rounded-xl bg-surface pl-4 pr-8 text-base font-semibold text-ink ring-1 ring-inset ring-border [appearance:textfield] focus:outline-none focus:ring-2 focus:ring-accent [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base text-muted">
                              m
                            </span>
                          </div>
                        </div>

                        <label htmlFor="builder-notes" className="mt-6 block text-base font-semibold text-ink">
                          Notes (optional)
                        </label>
                        <textarea
                          id="builder-notes"
                          rows={3}
                          maxLength={NOTES_MAX}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Ceiling height, sink or appliance positions, handles you like"
                          className="mt-2 block w-full rounded-xl bg-surface px-4 py-3 text-base leading-relaxed text-ink ring-1 ring-inset ring-border placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <p className="mt-1 text-right text-[13px] text-muted">
                          {notes.length}/{NOTES_MAX}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {index > 0 && (
                  <button type="button" onClick={() => go(index - 1)} className={buttonClass("secondary", "md")}>
                    <ArrowLeft />
                    Back
                  </button>
                )}
                {last ? (
                  <button type="button" onClick={add} className={buttonClass("accent", "md", "flex-1 sm:flex-none")}>
                    Add to inquiry
                  </button>
                ) : (
                  <button type="button" onClick={() => go(index + 1)} className={buttonClass("primary", "md", "flex-1 sm:flex-none")}>
                    Next: {STEP_LABEL[steps[index + 1]]}
                    <ArrowRight />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
