import { Reveal } from "@/components/Reveal";

const CLIENT_TYPES = ["Corporate", "Banks", "Schools", "Hospitals", "Government"] as const;

export function ClientStrip() {
  return (
    <section aria-labelledby="clients-heading" className="bg-surface">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-12 md:px-6 md:py-14 lg:flex-row lg:items-center lg:justify-between">
        <h2 id="clients-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
          Who we furnish
        </h2>
        <ul className="flex flex-wrap gap-2.5">
          {CLIENT_TYPES.map((name) => (
            <li key={name} className="rounded-xl bg-bg px-4 py-2.5 text-base font-medium text-ink md:px-5 md:text-lg">
              {name}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
