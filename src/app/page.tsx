import { ClientStrip } from "@/components/ClientStrip";
import { Hero } from "@/components/Hero";
import { HowWeWork } from "@/components/HowWeWork";
import { PathCards } from "@/components/PathCards";
import { QuoteCTA } from "@/components/QuoteCTA";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Hero />
      <ClientStrip />
      <PathCards />
      <HowWeWork />
      <Services />
      <QuoteCTA />
    </>
  );
}
