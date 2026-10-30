import Link from "next/link";
import { ADDRESS, EMAIL, FACEBOOK_URL, FOOTER_LINKS, LANDLINES, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

const contactLink = "font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-ink";

export function Footer() {
  return (
    <footer className="border-t-4 border-accent bg-bg pb-24 lg:pb-0">
      <div className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="text-2xl font-bold tracking-tight">Visit or call</h2>
            <address className="mt-4 space-y-2 text-base not-italic leading-relaxed text-ink">
              <p>{ADDRESS}</p>
              <p className="flex flex-wrap gap-x-4 gap-y-1">
                <a href={PHONE_TEL} className={contactLink}>
                  {PHONE_DISPLAY}
                </a>
                {LANDLINES.map((line) => (
                  <a key={line.tel} href={line.tel} className={contactLink}>
                    {line.display}
                  </a>
                ))}
              </p>
              <p>
                <a href={`mailto:${EMAIL}`} className={contactLink}>
                  {EMAIL}
                </a>
              </p>
              <p>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={contactLink}>
                  Facebook: designexcellence01
                </a>
              </p>
            </address>
          </div>

          <nav aria-label="Footer" className="md:col-span-4 md:col-start-8">
            <h2 className="text-2xl font-bold tracking-tight">Quick links</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-6 text-base">
              {FOOTER_LINKS.map((column, i) => (
                <ul key={i} className="space-y-2">
                  {column.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-accent-ink hover:underline hover:decoration-accent hover:decoration-2 hover:underline-offset-4">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 py-6 text-[14px] text-muted sm:flex-row sm:justify-between md:mt-16">
          <p>© Design Excellence. Custom cabinets and office furniture.</p>
          <p className="font-semibold text-ink">Demo by Say</p>
        </div>
      </div>
    </footer>
  );
}
