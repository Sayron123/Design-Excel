import Link from "next/link";
import {
  ADDRESS,
  EMAIL_PLACEHOLDER,
  FACEBOOK_PLACEHOLDER,
  NAV_LINKS,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-bg pb-24 lg:pb-0">
      <div className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="text-2xl font-bold tracking-tight">Visit or call</h2>
            <address className="mt-4 space-y-2 text-base not-italic leading-relaxed text-ink">
              <p>{ADDRESS}</p>
              <p>
                <a href={PHONE_TEL} className="font-semibold underline underline-offset-4 hover:text-primary">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p>{EMAIL_PLACEHOLDER}</p>
              <p>
                <a href={FACEBOOK_PLACEHOLDER} className="underline underline-offset-4 hover:text-primary">
                  Facebook
                </a>{" "}
                <span className="text-muted">(placeholder link)</span>
              </p>
            </address>
          </div>

          <nav aria-label="Footer" className="md:col-span-4 md:col-start-8">
            <h2 className="text-2xl font-bold tracking-tight">Quick links</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-base">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary hover:underline hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/quote" className="hover:text-primary hover:underline hover:underline-offset-4">
                  Get a quote
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* The name set to the exact content width at every viewport. */}
        <svg viewBox="0 0 1000 128" className="mt-16 block h-auto w-full" aria-hidden="true">
          <text
            x="0"
            y="104"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="fill-primary/10 font-heading font-bold"
            style={{ fontSize: 132, letterSpacing: "-0.04em" }}
          >
            Design Excellence
          </text>
        </svg>

        <div className="flex flex-col gap-2 py-6 text-[14px] text-muted sm:flex-row sm:justify-between">
          <p>© Design Excellence. Custom cabinets and office furniture.</p>
          <p className="font-semibold text-ink">Demo by Say</p>
        </div>
      </div>
    </footer>
  );
}
