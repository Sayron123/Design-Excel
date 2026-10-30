import Link from "next/link";
import { QUOTE_COUNT } from "@/lib/site";

// Floating quote button for phones (it truly floats, so it carries a shadow). Desktop uses the navbar one. taste-skill-ignore
// Hidden until the quote basket has something in it.
export function MobileQuoteButton() {
  if (QUOTE_COUNT === 0) return null;

  return (
    <Link
      href="/quote"
      className="fixed bottom-4 right-4 z-40 inline-flex h-12 items-center rounded-xl bg-primary px-5 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(28,31,38,0.5)] transition-transform active:scale-95 lg:hidden"
    >
      Quote ({QUOTE_COUNT})
    </Link>
  );
}
