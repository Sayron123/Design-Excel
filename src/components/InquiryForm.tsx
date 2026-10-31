"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitInquiry, type InquiryField, type InquiryState } from "@/app/inquire/actions";
import { ArrowRight, buttonClass } from "@/components/ui/button";
import { QtyStepper } from "@/components/ui/qty-stepper";
import { clearInquiry, removeFromInquiry, setInquiryQty, useInquiry } from "@/lib/inquiry-cart";
import { FLOOR_PLAN_ACCEPT, FLOOR_PLAN_MAX_BYTES } from "@/lib/inquiry-items";

const ease = [0.22, 1, 0.36, 1] as const;

const inputClass =
  "block w-full rounded-xl bg-surface px-4 text-base text-ink ring-1 ring-inset ring-border transition-shadow placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent aria-invalid:ring-2 aria-invalid:ring-red-700";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-base font-semibold text-ink">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[14px] text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[14px] font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: boolean) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

/** The visitor's inquiry list, editable before sending. */
function ItemList({ error }: { error?: string }) {
  const items = useInquiry();

  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-surface p-6">
        <p className="text-base leading-relaxed text-ink">
          No items yet. Add products from their pages or build a cabinet, or just describe the room below.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/products" className={buttonClass("soft", "sm")}>
            Browse products
          </Link>
          <Link href="/products/modular-kitchen" className={buttonClass("soft", "sm")}>
            Build a cabinet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease }}
              className="rounded-xl bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {item.href ? (
                    <Link href={item.href} className="text-base font-bold tracking-tight text-ink hover:text-accent-ink">
                      {item.name}
                    </Link>
                  ) : (
                    <p className="text-base font-bold tracking-tight text-ink">{item.name}</p>
                  )}
                  {item.detail && <p className="mt-1 text-[14px] leading-snug text-muted">{item.detail}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => removeFromInquiry(item.id)}
                  className="shrink-0 rounded-lg px-2 py-1 text-[14px] font-semibold text-ink underline decoration-border decoration-2 underline-offset-4 hover:text-accent-ink hover:decoration-accent"
                  aria-label={`Remove ${item.name}`}
                >
                  Remove
                </button>
              </div>
              <QtyStepper
                value={item.qty}
                onChange={(qty) => setInquiryQty(item.id, qty)}
                label={`Quantity of ${item.name}`}
                className="mt-3"
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {error && <p className="mt-2 text-[14px] font-semibold text-red-700">{error}</p>}
    </div>
  );
}

function Success({ reference }: { reference: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="rounded-2xl bg-primary p-6 text-white md:p-10"
      role="status"
    >
      <h2 ref={headingRef} tabIndex={-1} className="text-3xl font-bold tracking-tight focus:outline-none md:text-4xl">
        Thank you, we have your inquiry
      </h2>
      <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-white/90">
        We will look over the items and your notes, then call or email you with questions or a first layout.
      </p>
      {reference !== "received" && (
        <p className="mt-6 text-base text-white/85">
          Reference <span className="font-heading text-2xl font-bold tracking-tight text-white">{reference}</span>
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/products" className={buttonClass("accent", "md")}>
          Back to products
          <ArrowRight />
        </Link>
        <Link href="/" className={buttonClass("glass", "md")}>
          Home
        </Link>
      </div>
    </motion.div>
  );
}

/** The quote request form. Sends through a server action, which checks and saves it to Supabase. */
export function InquiryForm() {
  const items = useInquiry();
  const [state, formAction, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const [fileError, setFileError] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<"office" | "home">("office");
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "success") clearInquiry();
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  if (state.status === "success") return <Success reference={state.reference} />;

  const errors: Partial<Record<InquiryField, string>> = state.status === "error" ? { ...state.fieldErrors } : {};
  if (fileError) errors.floorPlan = fileError;

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileError(file && file.size > FLOOR_PLAN_MAX_BYTES ? "The floor plan is over 4 MB. Send a smaller file, or email it to us." : null);
  }

  // Submitting through a transition (not <form action>) keeps every field, the file included,
  // when the server sends the form back with errors.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fileError) return;
    const data = new FormData(e.currentTarget);
    data.set("items", JSON.stringify(items));
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="space-y-6 lg:col-span-7">
        {state.status === "error" && (
          <p ref={errorRef} tabIndex={-1} role="alert" className="rounded-xl bg-red-700/10 px-4 py-3 text-base font-semibold text-red-800 focus:outline-none">
            {state.message}
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="company" label="Company or name" error={errors.company}>
            <input
              id="company"
              name="company"
              required
              maxLength={120}
              autoComplete="organization"
              aria-invalid={errors.company ? true : undefined}
              aria-describedby={describedBy("company", errors.company)}
              className={`${inputClass} h-12`}
            />
          </Field>
          <Field id="contact" label="Contact person" error={errors.contact}>
            <input
              id="contact"
              name="contact"
              required
              maxLength={80}
              autoComplete="name"
              aria-invalid={errors.contact ? true : undefined}
              aria-describedby={describedBy("contact", errors.contact)}
              className={`${inputClass} h-12`}
            />
          </Field>
          <Field id="phone" label="Phone" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              maxLength={30}
              autoComplete="tel"
              placeholder="0917 123 4567"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={describedBy("phone", errors.phone)}
              className={`${inputClass} h-12`}
            />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={160}
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email", errors.email)}
              className={`${inputClass} h-12`}
            />
          </Field>
        </div>

        <fieldset>
          <legend className="text-base font-semibold text-ink">Project type</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["office", "home"] as const).map((type) => (
              <label
                key={type}
                className={`flex h-14 cursor-pointer items-center justify-center rounded-xl text-lg font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent ${
                  projectType === type ? "bg-primary text-white" : "bg-surface text-ink ring-1 ring-inset ring-border hover:bg-accent/20"
                }`}
              >
                <input
                  type="radio"
                  name="projectType"
                  value={type}
                  checked={projectType === type}
                  onChange={() => setProjectType(type)}
                  className="sr-only"
                />
                {type === "office" ? "Office" : "Home"}
              </label>
            ))}
          </div>
          {errors.projectType && <p className="mt-2 text-[14px] font-semibold text-red-700">{errors.projectType}</p>}
        </fieldset>

        <Field id="notes" label="Notes" error={errors.notes} hint="The room, the number of people, your deadline, anything we should know.">
          <textarea
            id="notes"
            name="notes"
            rows={5}
            maxLength={2000}
            aria-invalid={errors.notes ? true : undefined}
            aria-describedby={describedBy("notes", errors.notes, true)}
            className={`${inputClass} py-3 leading-relaxed`}
          />
        </Field>

        <Field id="floorPlan" label="Floor plan (optional)" error={errors.floorPlan} hint="PDF, JPG, PNG or DWG, up to 4 MB.">
          <input
            id="floorPlan"
            name="floorPlan"
            type="file"
            accept={FLOOR_PLAN_ACCEPT}
            onChange={onFileChange}
            aria-invalid={errors.floorPlan ? true : undefined}
            aria-describedby={describedBy("floorPlan", errors.floorPlan, true)}
            className="block w-full text-base text-ink file:mr-4 file:h-12 file:cursor-pointer file:rounded-xl file:border-0 file:bg-primary/10 file:px-5 file:font-semibold file:text-primary hover:file:bg-accent hover:file:text-ink"
          />
        </Field>

        {/* Hidden from people; bots that fill every field give themselves away here. taste-skill-ignore (off-screen, not a rule) */}
        <div aria-hidden="true" /* off-screen honeypot, taste-skill-ignore */ className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit" disabled={pending} className={buttonClass("accent", "lg", "w-full sm:w-auto disabled:cursor-wait disabled:opacity-70")}>
          {pending ? "Sending…" : "Send inquiry"}
        </button>
      </div>

      {/* On a phone the list comes first: check what you are asking about, then say who you are. */}
      <div className="order-first lg:order-none lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <h2 className="text-2xl font-bold tracking-tight">
            Items {items.length > 0 && <span className="text-muted">({items.reduce((s, i) => s + i.qty, 0)})</span>}
          </h2>
          <div className="mt-4">
            <ItemList error={errors.items} />
          </div>
        </div>
      </div>
    </form>
  );
}
