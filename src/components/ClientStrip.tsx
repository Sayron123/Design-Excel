import { Reveal } from "@/components/Reveal";

const CLIENT_TYPES = ["Corporate", "Banks", "Schools", "Hospitals", "Government"] as const;

export function ClientStrip() {
  return (
    <section aria-labelledby="clients-heading">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-12 md:px-6 md:py-14 lg:flex-row lg:items-center lg:justify-between">
        <h2 id="clients-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
          Who we furnish
        </h2>
        <ul className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-lg font-medium text-ink">
          {CLIENT_TYPES.map((name, i) => (
            <li key={name} className="flex items-baseline gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-muted">
                  ·
                </span>
              )}
              {name}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
