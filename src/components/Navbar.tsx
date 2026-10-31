"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { RetryImage } from "@/components/ui/retry-image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, buttonClass } from "@/components/ui/button";
import { PRODUCT_GROUPS, categoriesInGroup, categoryHref } from "@/lib/products";
import { INQUIRE_HREF, INQUIRE_LABEL, INQUIRY_COUNT, NAV_LINKS, type NavId } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

// Home-page sections that start a nav item's stretch of the page, in page order.
// The inquiry band and the footer below it count as Contact.
const SPY_SECTIONS: { id: string; nav: NavId }[] = [
  { id: "products", nav: "products" },
  { id: "how-we-work", nav: "how" },
  { id: "quote-cta", nav: "contact" },
];

/**
 * Which nav item is current: the route decides on inner pages; on the home page it is the last
 * section whose top has passed 35% down the screen (Home above the first one), and the last
 * section once the page is scrolled to the bottom.
 */
function useActiveNav(pathname: string): NavId | null {
  const [section, setSection] = useState<NavId>("home");

  useEffect(() => {
    if (pathname !== "/") return;
    let frame = 0;
    function update() {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current: NavId = "home";
      for (const s of SPY_SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && (atBottom || el.getBoundingClientRect().top <= line)) current = s.nav;
      }
      setSection(current);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (pathname === "/") return section;
  if (pathname.startsWith("/products")) return "products";
  if (pathname === "/about") return "about";
  if (pathname === INQUIRE_HREF) return "contact";
  return null;
}

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

/** Tinted pill behind the current nav item; slides between items. */
function ActivePill() {
  return (
    <motion.span
      layoutId="nav-active"
      aria-hidden="true"
      className="absolute inset-0 -z-10 rounded-lg bg-accent/20"
      transition={{ type: "spring", stiffness: 420, damping: 36 }}
    />
  );
}

const navItem = "relative z-0 inline-flex h-10 items-center gap-1.5 rounded-lg px-2 xl:px-3 text-base font-medium transition-colors";

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
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen((v) => !v)}
        className={`${navItem} ${active || open ? "text-ink" : "text-ink hover:text-accent-ink"}`}
      >
        {active && <ActivePill />}
        Products
        <Chevron open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <div className="absolute left-1/2 top-full w-184 -translate-x-1/2 pt-4">
            <motion.div
              id="products-menu"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease }}
              className="rounded-2xl bg-surface p-4 shadow-[0_24px_60px_-20px_rgba(28,31,38,0.35)] ring-1 ring-ink/5"
            >
              <div className="grid grid-cols-2 gap-x-4">
                {PRODUCT_GROUPS.map((group) => (
                  <div key={group.id}>
                    <p className="px-3 pb-3 pt-2 text-[14px] font-semibold text-muted">{group.name}</p>
                    <ul className="space-y-1">
                      {categoriesInGroup(group.id).map((cat) => {
                        const thumb = cat.images[0];
                        return (
                          <li key={cat.slug}>
                            <Link
                              href={categoryHref(cat.slug)}
                              onClick={() => setOpen(false)}
                              className="group flex items-center gap-4 rounded-xl p-2.5 transition-colors hover:bg-bg focus-visible:bg-bg"
                            >
                              <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-ink/5">
                                <RetryImage
                                  src={thumb.src}
                                  alt=""
                                  fill
                                  sizes="64px"
                                  className={thumb.fit === "contain" ? "object-contain p-1" : "object-cover"}
                                />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-base font-semibold text-ink group-hover:text-accent-ink">
                                  {cat.name}
                                </span>
                                <span className="mt-0.5 block truncate text-[14px] text-muted">{cat.summary}</span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-bg px-5 py-3.5">
                <p className="text-[14px] text-ink">Not sure what you need? We plan the room first.</p>
                <Link href="/products" onClick={() => setOpen(false)} className={buttonClass("soft", "sm")}>
                  All products
                  <ArrowRight />
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
  const activeNav = useActiveNav(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { scrollY } = useScroll();

  // Bar gains a shadow and blur once the page has moved past 20px.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 20));

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
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link href="/" className="shrink-0" onClick={closeMobile}>
          <RetryImage
            src="/logo.png"
            alt="Design Excellence, Home & Office System Co."
            width={400}
            height={45}
            loading="eager"
            className="h-6.5 w-auto sm:h-8 xl:h-9"
          />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = activeNav === link.id;
            return link.id === "products" ? (
              <ProductsMenu key={link.id} active={active} />
            ) : (
              <li key={link.id}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`${navItem} ${active ? "text-ink" : "text-ink hover:text-accent-ink"}`}
                >
                  {active && <ActivePill />}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden lg:block">
            <Link href={INQUIRE_HREF} className={buttonClass("accent", "sm", "text-base")}>
              {INQUIRY_COUNT > 0 ? `Inquiry (${INQUIRY_COUNT})` : INQUIRE_LABEL}
            </Link>
          </span>
          <button
            type="button"
            className={buttonClass("secondary", "sm", "text-base lg:hidden")}
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
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-6 pt-2">
              {NAV_LINKS.map((link) => {
                const active = activeNav === link.id;
                const rowClass = `flex w-full items-center justify-between rounded-xl px-4 py-3 font-heading text-2xl font-bold ${
                  active ? "bg-accent/20 text-ink" : "text-ink"
                }`;
                return link.id === "products" ? (
                  <li key={link.id}>
                    <button
                      type="button"
                      aria-expanded={productsOpen}
                      aria-controls="mobile-products"
                      aria-current={active ? "page" : undefined}
                      onClick={() => setProductsOpen((v) => !v)}
                      className={rowClass}
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
                          <div className="mb-2 mt-1 rounded-xl bg-surface p-3">
                            {PRODUCT_GROUPS.map((group) => (
                              <div key={group.id} className="mb-3">
                                <p className="px-2 pb-1 pt-1 text-[14px] font-semibold text-muted">{group.name}</p>
                                <ul>
                                  {categoriesInGroup(group.id).map((cat) => (
                                    <li key={cat.slug}>
                                      <Link
                                        href={categoryHref(cat.slug)}
                                        onClick={closeMobile}
                                        className="flex items-center gap-3 rounded-lg p-2 text-lg font-semibold text-ink active:bg-bg"
                                      >
                                        <span className="relative h-10 w-12 shrink-0 overflow-hidden rounded-md bg-white ring-1 ring-ink/5">
                                          <RetryImage
                                            src={cat.images[0].src}
                                            alt=""
                                            fill
                                            sizes="48px"
                                            className={cat.images[0].fit === "contain" ? "object-contain p-0.5" : "object-cover"}
                                          />
                                        </span>
                                        {cat.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                            <Link href="/products" onClick={closeMobile} className={buttonClass("soft", "md", "w-full")}>
                              All products
                              <ArrowRight />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ) : (
                  <li key={link.id}>
                    <Link href={link.href} aria-current={active ? "page" : undefined} className={rowClass} onClick={closeMobile}>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-3">
                <Link href={INQUIRE_HREF} onClick={closeMobile} className={buttonClass("accent", "lg", "w-full")}>
                  {INQUIRE_LABEL}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
