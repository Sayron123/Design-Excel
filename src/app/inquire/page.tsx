import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { Reveal } from "@/components/Reveal";
import { PhoneIcon, buttonClass } from "@/components/ui/button";
import { ADDRESS, EMAIL, FACEBOOK_URL, LANDLINES, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const metadata: Metadata = { title: "Inquire now | Design Excellence" };

const MAIL_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent("Inquiry from the website")}&body=${encodeURIComponent(
  "Room or project:\nNumber of people:\nDeadline:\nFloor plan or measurements attached: yes / no\n",
)}`;

const DIRECTIONS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

// The quote request form, with the direct ways to reach the showroom below it.
export default function InquirePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <Reveal>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Inquire now</h1>
        <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink">
          Tell us the room, the number of people and your deadline. We will come back with a layout and a price.
        </p>
      </Reveal>

      <Reveal className="mt-10 md:mt-14" delay={0.06}>
        <InquiryForm />
      </Reveal>

      <Reveal className="mt-20 md:mt-32">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Rather talk to us?</h2>
      </Reveal>
      <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2">
        <Reveal className="rounded-xl bg-primary p-6 text-white md:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Call us</h2>
          <p className="mt-2 text-base leading-relaxed text-white/85">One mobile number and two Metro Manila landlines.</p>
          <div className="mt-6 flex flex-col items-start gap-3">
            <a href={PHONE_TEL} className={buttonClass("accent", "lg")}>
              <PhoneIcon />
              {PHONE_DISPLAY}
            </a>
            {LANDLINES.map((line) => (
              <a key={line.tel} href={line.tel} className={buttonClass("glass", "md")}>
                <PhoneIcon />
                {line.display}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal className="rounded-xl bg-surface p-6 md:p-8" delay={0.08}>
          <h2 className="text-2xl font-bold tracking-tight">Email or message</h2>
          <p className="mt-2 text-base leading-relaxed text-ink">
            Send your floor plan or measurements and we will reply with questions or a first layout.
          </p>
          <div className="mt-6 flex flex-col items-start gap-3">
            <a href={MAIL_HREF} className={buttonClass("primary", "md")}>
              {EMAIL}
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={buttonClass("soft", "md")}>
              Message us on Facebook
            </a>
          </div>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">Visit the showroom</h2>
          <p className="mt-2 text-base leading-relaxed text-ink">{ADDRESS}</p>
          <a
            href={DIRECTIONS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-ink"
          >
            Get directions
          </a>
        </Reveal>
      </div>
    </section>
  );
}
