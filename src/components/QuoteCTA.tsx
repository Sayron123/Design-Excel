import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ShowroomMap } from "@/components/ShowroomMap";
import { INQUIRE_HREF, INQUIRE_LABEL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import { PhoneIcon, buttonClass } from "@/components/ui/button";

export function QuoteCTA() {
  return (
    <section id="quote-cta" aria-labelledby="cta-heading" className="bg-primary text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Reveal className="lg:col-span-5">
          <h2 id="cta-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            Send us your floor plan
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-white/90">
            Tell us the room, the number of people and your deadline. We will come back with a layout and a price.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={INQUIRE_HREF} className={buttonClass("accent", "lg")}>
              {INQUIRE_LABEL}
            </Link>
            <a href={PHONE_TEL} className={buttonClass("glass", "lg")}>
              <PhoneIcon />
              {PHONE_DISPLAY}
            </a>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.1}>
          <ShowroomMap />
        </Reveal>
      </div>
    </section>
  );
}
