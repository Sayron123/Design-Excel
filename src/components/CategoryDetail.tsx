import { RetryImage } from "@/components/ui/retry-image";
import Link from "next/link";
import { ModelFilter } from "@/components/ModelFilter";
import { ProductGallery } from "@/components/ProductGallery";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft, ArrowRight, PhoneIcon, buttonClass } from "@/components/ui/button";
import { MODELS } from "@/lib/models";
import { PRODUCT_CATEGORIES, categoryHref, type ProductCategory } from "@/lib/products";
import { INQUIRE_HREF, INQUIRE_LABEL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

// One product category: photos, its types (from the client's site) and the inquiry action.
export function CategoryDetail({ category, note }: { category: ProductCategory; note?: string }) {
  // Four other categories, same range first, so the row is always full.
  const others = PRODUCT_CATEGORIES.filter((c) => c.slug !== category.slug);
  const related = [
    ...others.filter((c) => c.group === category.group),
    ...others.filter((c) => c.group !== category.group),
  ].slice(0, 4);
  const models = MODELS[category.slug];

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-8 md:px-6 md:pb-20 md:pt-12">
        <Link href="/products" className={buttonClass("soft", "sm", "mb-8")}>
          <ArrowLeft />
          All products
        </Link>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:order-2 lg:col-span-7">
            <ProductGallery images={category.images} name={category.name} />
          </Reveal>

          <Reveal className="lg:order-1 lg:col-span-5 lg:self-center" delay={0.08}>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{category.name}</h1>
            <p className="mt-4 max-w-[40ch] text-lg leading-relaxed text-ink">{category.summary}</p>
            {note && <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-ink">{note}</p>}

            {/* With models, the filter below already lists the types, so the header only points to it. */}
            {models ? (
              <a href="#models" className={buttonClass("soft", "sm", "mt-8")}>
                See all {models.length} models
                <ArrowRight className="rotate-90" />
              </a>
            ) : (
              category.types && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold tracking-tight">Types</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {category.types.map((type) => (
                      <li key={type} className="rounded-lg bg-surface px-3.5 py-2 text-base text-ink">
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={INQUIRE_HREF} className={buttonClass("accent", "md")}>
                {INQUIRE_LABEL}
              </Link>
              <a href={PHONE_TEL} className={buttonClass("secondary", "md")}>
                <PhoneIcon />
                Call {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-6 text-[14px] text-muted">Sizes, finishes and prices: placeholder, to be added.</p>
          </Reveal>
        </div>
      </section>

      {models && category.types && (
        <ModelFilter title={`Choose a ${category.name.replace(" Series", "").toLowerCase()}`} types={category.types} models={models} />
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
            <h2 id="related-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
              More products
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {related.map((cat) => (
                <li key={cat.slug}>
                  <Link href={categoryHref(cat.slug)} className="group block">
                    <span className={`relative block aspect-4/3 overflow-hidden rounded-lg ${cat.images[0].fit === "contain" ? "bg-white" : "bg-bg"}`}>
                      <RetryImage
                        src={cat.images[0].src}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className={`transition-transform duration-500 group-hover:scale-[1.04] ${
                          cat.images[0].fit === "contain" ? "object-contain p-3" : "object-cover"
                        }`}
                      />
                    </span>
                    <span className="mt-2 block text-base font-semibold text-ink group-hover:text-accent-ink">{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
