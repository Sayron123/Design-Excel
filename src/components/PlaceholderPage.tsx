import Link from "next/link";
import type { ReactNode } from "react";

// Shared shell for routes that exist so links resolve, but are not built yet.
export function PlaceholderPage({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink">This page is a placeholder and is not built yet.</p>
      {children}
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-white transition-colors hover:bg-ink"
      >
        Back to home
      </Link>
    </section>
  );
}
