// Product catalogue structure, taken from the categories on design-excellence.ph.
// Category and type names are the client's own; summaries are ours and should be confirmed.

export type ProductGroupId = "office-furniture" | "cabinets-closets";

export type ProductCategory = {
  slug: string;
  name: string;
  group: ProductGroupId;
  summary: string;
  types?: string[];
};

export const PRODUCT_GROUPS: { id: ProductGroupId; name: string }[] = [
  { id: "office-furniture", name: "Office furniture" },
  { id: "cabinets-closets", name: "Cabinets and closets" },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: "chairs",
    name: "Chair Series",
    group: "office-furniture",
    summary: "Chairs for desks, meeting rooms, training rooms, lounges and auditoriums.",
    types: [
      "Leatherette chair",
      "Mesh chair",
      "Fabric upholstered chair",
      "Bar stool",
      "Lounge chair",
      "Training chair",
      "Theater seat",
      "Gang chair",
      "Lounge set",
    ],
  },
  {
    slug: "tables",
    name: "Table Series",
    group: "office-furniture",
    summary: "Tables for executives, conference rooms, lounges and flexible spaces.",
    types: [
      "Coffee table",
      "Executive table",
      "Wood executive table",
      "Conference table",
      "Folding table",
      "Free-standing table",
    ],
  },
  {
    slug: "workstations",
    name: "Workstations",
    group: "office-furniture",
    summary: "Desk systems for open offices, from a single desk to full clusters.",
  },
  {
    slug: "partitions",
    name: "Partitions",
    group: "office-furniture",
    summary: "Partitions that divide one floor into rooms and work areas.",
  },
  {
    slug: "reception-area",
    name: "Reception Area",
    group: "office-furniture",
    summary: "Reception counters and seating for the people waiting.",
  },
  {
    slug: "cabinets",
    name: "Metal Cabinets",
    group: "cabinets-closets",
    summary: "Metal storage and filing cabinets, made to your measurements.",
  },
  {
    slug: "kitchen-cabinets",
    name: "Modular Kitchen Cabinets",
    group: "cabinets-closets",
    summary: "Modular kitchen cabinets for homes and office pantries.",
  },
  {
    slug: "walk-in-closets",
    name: "Modular Walk-in Closets",
    group: "cabinets-closets",
    summary: "Modular walk-in closets fitted to the room.",
  },
];

/** Every category lives under /products. Cabinets has its own folder (the cabinet builder). */
export function categoryHref(slug: string) {
  return `/products/${slug}`;
}

export function getCategory(slug: string) {
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug);
}

export function categoriesInGroup(group: ProductGroupId) {
  return PRODUCT_CATEGORIES.filter((c) => c.group === group);
}
