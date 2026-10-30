import Link from "next/link";
import type { ReactNode } from "react";

type PlaceholderPageProps = {
  title: string;
  intro?: string;
  breadcrumb?: { href: string; label: string };
  back?: { href: string; label: string };
  children?: ReactNode;
};

// Shared shell for routes that exist so links resolve, but are not built yet.
export function PlaceholderPage({
  title,
  intro,
  breadcrumb,
  back = { href: "/", label: "Back to home" },
  children,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      {breadcrumb && (
        <nav aria-label="Breadcrumb" className="mb-4 text-base">
          <Link href={breadcrumb.href} className="text-primary underline underline-offset-4 hover:text-ink">
            {breadcrumb.label}
          </Link>
          <span aria-hidden="true" className="px-2 text-muted">
            /
          </span>
          <span aria-current="page" className="text-ink">
            {title}
          </span>
        </nav>
      )}
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
      {intro && <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink">{intro}</p>}
      <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted">This page is a placeholder and is not built yet.</p>
      {children}
      <Link
        href={back.href}
        className="mt-10 inline-flex h-12 items-center rounded-xl bg-primary px-6 font-semibold text-white transition-colors hover:bg-ink"
      >
        {back.label}
      </Link>
    </section>
  );
}
