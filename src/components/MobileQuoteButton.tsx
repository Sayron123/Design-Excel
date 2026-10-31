"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInquiryCount } from "@/lib/inquiry-cart";
import { INQUIRE_HREF } from "@/lib/site";

// Floating inquiry button for phones (it truly floats, so it carries a shadow). Desktop uses the navbar one. taste-skill-ignore
// Hidden until the inquiry list has something in it, and on the pages where it would point at itself.
export function MobileQuoteButton() {
  const count = useInquiryCount();
  const pathname = usePathname();
  if (count === 0 || pathname === INQUIRE_HREF || pathname.startsWith("/admin")) return null;

  return (
    <Link
      href={INQUIRE_HREF}
      className="fixed bottom-4 right-4 z-40 inline-flex h-12 items-center rounded-xl bg-accent px-5 text-base font-semibold text-ink shadow-[0_10px_30px_-10px_rgba(28,31,38,0.5)] transition-transform active:scale-95 lg:hidden"
    >
      Inquiry ({count})
    </Link>
  );
}
