import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { ADDRESS, EMAIL_PLACEHOLDER, FACEBOOK_PLACEHOLDER, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const metadata: Metadata = { title: "Quote and contact | Design Excellence" };

// Contact details live here; the quote form comes later.
export default function QuotePage() {
  return (
    <PlaceholderPage title="Quote and contact">
      <div className="mt-10 max-w-xl rounded-xl bg-surface p-6 md:p-8">
        <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
        <address className="mt-4 space-y-2 text-base not-italic leading-relaxed">
          <p>
            <a href={PHONE_TEL} className="font-semibold text-primary underline underline-offset-4">
              Call {PHONE_DISPLAY}
            </a>
          </p>
          <p>{ADDRESS}</p>
          <p>{EMAIL_PLACEHOLDER}</p>
          <p>
            <a href={FACEBOOK_PLACEHOLDER} className="underline underline-offset-4">
              Facebook
            </a>{" "}
            <span className="text-muted">(placeholder link)</span>
          </p>
        </address>
      </div>
    </PlaceholderPage>
  );
}
