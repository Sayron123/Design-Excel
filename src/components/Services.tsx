import { Reveal } from "@/components/Reveal";

const SERVICES = [
  {
    name: "Design consultation",
    body: "A conversation about how the space works, who uses it and what it needs to hold, before any furniture is chosen.",
  },
  {
    name: "Furniture quotations",
    body: "An itemised quotation for the cabinets and furniture in your layout, so you can budget and get approval.",
  },
  {
    name: "Rendered layout",
    body: "A rendered view of the furnished space, so you and your team can see the finished room before it is built.",
  },
  {
    name: "Floor plan layout",
    body: "A measured floor plan with every piece placed, showing walkways and clearances, drawn in AutoCAD.",
  },
] as const;

export function Services() {
  return (
    <section aria-labelledby="services-heading" className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <h2 id="services-heading" className="text-3xl font-bold tracking-tight md:text-5xl">
              Services
            </h2>
            <p className="mt-4 max-w-[34ch] text-lg leading-relaxed text-ink">
              What we prepare for you before and alongside the furniture itself.
            </p>
          </div>
        </Reveal>
        <ul className="grid gap-3 md:col-span-8">
          {SERVICES.map((service, i) => (
            <li key={service.name}>
              <Reveal delay={i * 0.06}>
                <div className="grid gap-2 rounded-xl bg-surface p-6 md:grid-cols-5 md:gap-8 md:p-8">
                  <h3 className="text-2xl font-bold tracking-tight md:col-span-2">{service.name}</h3>
                  <p className="text-base leading-relaxed text-ink md:col-span-3 md:text-lg">{service.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
