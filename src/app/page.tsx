import { BuilderTeaser } from "@/components/BuilderTeaser";
import { ClientStrip } from "@/components/ClientStrip";
import { FloorPlan } from "@/components/FloorPlan";
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
      <BuilderTeaser />
      <FloorPlan />
      <HowWeWork />
      <Services />
      <QuoteCTA />
    </>
  );
}
