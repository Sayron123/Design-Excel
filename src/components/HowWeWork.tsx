import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { StickyScroll, type StickyScrollItem } from "@/components/ui/sticky-scroll-reveal";

function StepPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] h-full w-full bg-border">
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
      <span className="absolute bottom-3 left-3 rounded-lg bg-ink/75 px-2.5 py-1 text-[14px] text-white">
        Placeholder image
      </span>
    </div>
  );
}

// A drawn layout sheet: one room with furniture and dimension lines, white on the primary blue.
function LayoutSheet() {
  const line = { stroke: "white", fill: "none" } as const;
  return (
    <div className="flex aspect-[4/3] h-full w-full items-center justify-center bg-primary p-6">
      <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Drawing of a room layout with dimensions">
        <rect x="60" y="40" width="280" height="200" {...line} strokeWidth="6" />
        <rect x="90" y="70" width="120" height="50" rx="4" {...line} strokeWidth="1.5" />
        <rect x="230" y="70" width="80" height="50" rx="4" {...line} strokeWidth="1.5" />
        <rect x="90" y="170" width="220" height="40" rx="4" {...line} strokeWidth="1.5" />
        {[110, 150, 190, 250, 290].map((x) => (
          <circle key={x} cx={x} cy="140" r="8" {...line} strokeWidth="1.5" />
        ))}
        {/* dimension lines */}
        <path d="M60 266 H340 M60 258 V274 M340 258 V274" {...line} strokeWidth="1.25" />
        <path d="M30 40 V240 M22 40 H38 M22 240 H38" {...line} strokeWidth="1.25" />
        <text x="200" y="290" textAnchor="middle" fill="white" fontSize="15">
          7,000
        </text>
        <text x="18" y="145" textAnchor="middle" fill="white" fontSize="15" transform="rotate(-90 18 145)">
          5,000
        </text>
      </svg>
    </div>
  );
}

const STEPS: StickyScrollItem[] = [
  {
    title: "Consultation",
    description:
      "We talk through how the space is used, how many people it holds and what has to fit. Bring a floor plan or measurements if you have them.",
    content: <StepPhoto src="/placeholder/consult.jpg" alt="Placeholder image: long wooden table in a bright room" />,
  },
  {
    title: "AutoCAD layout",
    description:
      "We draw your space and the furniture in AutoCAD, so sizes, walkways and positions are agreed on paper before anything is made.",
    content: <LayoutSheet />,
  },
  {
    title: "Manufacturing",
    description: "Cabinets and furniture are made to the approved layout, sizes and finishes.",
    content: <StepPhoto src="/placeholder/making.jpg" alt="Placeholder image: hand tools laid out on dark wood" />,
  },
  {
    title: "Delivery & install",
    description: "We deliver, assemble and install everything on site, in the positions shown on the layout.",
    content: <StepPhoto src="/placeholder/install.jpg" alt="Placeholder image: people at tall office windows over a city" />,
  },
];

export function HowWeWork() {
  return (
    <section id="how-we-work" aria-labelledby="how-heading">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <Reveal>
          <h2 id="how-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            How we work
          </h2>
          <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink">
            Four stages, from the first conversation to furniture standing in your room.
          </p>
        </Reveal>
        <div className="mt-10 md:mt-16">
          <StickyScroll content={STEPS} />
        </div>
      </div>
    </section>
  );
}
