"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PRODUCT_GROUPS, categoriesInGroup, categoryHref } from "@/lib/products";
import { NAV_LINKS, QUOTE_COUNT } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Desktop "Products" item: opens on click or hover, closes on Escape, outside click or navigation. */
function ProductsMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Hover opens for mouse users only; a short delay stops the panel flickering shut on the way down.
  function onPointerEnter(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function onPointerLeave(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }

  return (
    <li ref={rootRef} className="relative" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="products-menu"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 text-base font-medium transition-colors hover:text-primary ${
          active || open ? "text-primary" : "text-ink"
        }`}
      >
        Products
        <Chevron open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <div className="absolute left-1/2 top-full w-[38rem] -translate-x-1/2 pt-5">
            <motion.div
              id="products-menu"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease }}
              className="rounded-xl bg-surface p-3 shadow-[0_24px_60px_-20px_rgba(28,31,38,0.35)] ring-1 ring-ink/5"
            >
              <div className="grid grid-cols-2 gap-1">
                {PRODUCT_GROUPS.map((group) => (
                  <div key={group.id} className="p-3">
                    <p className="px-3 pb-2 text-[14px] font-semibold text-muted">{group.name}</p>
                    <ul>
                      {categoriesInGroup(group.id).map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            href={categoryHref(cat.slug)}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-bg focus-visible:bg-bg"
                          >
                            <span className="block text-base font-semibold text-ink">{cat.name}</span>
                            <span className="mt-0.5 block text-[14px] leading-snug text-muted">{cat.summary}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-1 flex items-center justify-between rounded-lg bg-bg px-6 py-4">
                <p className="text-[14px] text-ink">Not sure what you need? We plan the room first.</p>
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="text-[14px] font-semibold text-primary underline underline-offset-4 hover:text-ink"
                >
                  All products
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { scrollY } = useScroll();

  // Bar gains a shadow and blur once the page has moved past 20px.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 20));

  const inProducts = pathname.startsWith("/products");

  function closeMobile() {
    setOpen(false);
    setProductsOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? "bg-bg/85 shadow-[0_6px_24px_-12px_rgba(28,31,38,0.25)] backdrop-blur-md" : "bg-bg"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/" className="shrink-0" onClick={closeMobile}>
          <Image
            src="/logo.png"
            alt="Design Excellence, Home & Office System Co."
            width={400}
            height={45}
            priority
            className="h-6.5 w-auto sm:h-8 xl:h-9"
          />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) =>
            link.href === "/products" ? (
              <ProductsMenu key={link.href} active={inProducts} />
            ) : (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`text-base font-medium transition-colors hover:text-primary ${
                    pathname === link.href && link.href !== "/" ? "text-primary" : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/quote"
            className="hidden rounded-xl bg-primary px-4 py-2.5 text-base font-semibold text-white transition-colors hover:bg-ink lg:inline-flex"
          >
            {QUOTE_COUNT > 0 ? `Quote (${QUOTE_COUNT})` : "Get a quote"}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-xl px-3 text-base font-semibold text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => (open ? closeMobile() : setOpen(true))}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="max-h-[calc(100svh-4rem)] overflow-y-auto lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-4 pb-6 pt-2">
              {NAV_LINKS.map((link) =>
                link.href === "/products" ? (
                  <li key={link.href}>
                    <button
                      type="button"
                      aria-expanded={productsOpen}
                      aria-controls="mobile-products"
                      onClick={() => setProductsOpen((v) => !v)}
                      className="flex w-full items-center justify-between py-3 font-heading text-2xl font-bold text-ink"
                    >
                      Products
                      <Chevron open={productsOpen} />
                    </button>
                    <AnimatePresence initial={false}>
                      {productsOpen && (
                        <motion.div
                          id="mobile-products"
                          className="overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease }}
                        >
                          <div className="mb-3 rounded-xl bg-surface p-4">
                            {PRODUCT_GROUPS.map((group) => (
                              <div key={group.id} className="mb-4 last:mb-2">
                                <p className="pb-1 text-[14px] font-semibold text-muted">{group.name}</p>
                                <ul>
                                  {categoriesInGroup(group.id).map((cat) => (
                                    <li key={cat.slug}>
                                      <Link
                                        href={categoryHref(cat.slug)}
                                        onClick={closeMobile}
                                        className="block py-2 text-lg font-semibold text-ink"
                                      >
                                        {cat.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                            <Link
                              href="/products"
                              onClick={closeMobile}
                              className="inline-block pt-1 text-base font-semibold text-primary underline underline-offset-4"
                            >
                              All products
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link href={link.href} className="block py-3 font-heading text-2xl font-bold text-ink" onClick={closeMobile}>
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
