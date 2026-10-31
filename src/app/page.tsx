import { Hero } from "@/components/Hero";
import { HowWeWork } from "@/components/HowWeWork";
import { PathCards } from "@/components/PathCards";
import { QuoteCTA } from "@/components/QuoteCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <PathCards />
      <HowWeWork />
      <QuoteCTA />
    </>
  );
}
