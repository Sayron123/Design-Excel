import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, buttonClass } from "@/components/ui/button";

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
        <Link href={breadcrumb.href} className={buttonClass("soft", "sm", "mb-8")}>
          <ArrowLeft />
          {breadcrumb.label}
        </Link>
      )}
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
      {intro && <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink">{intro}</p>}
      <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted">This page is a placeholder and is not built yet.</p>
      {children}
      <Link
        href={back.href}
        className={buttonClass("primary", "md", "mt-10")}
      >
        {back.label}
      </Link>
    </section>
  );
}
