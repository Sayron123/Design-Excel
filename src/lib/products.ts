// Product catalogue structure, taken from the categories on design-excellence.ph.
// Category and type names are the client's own; summaries are ours and should be confirmed.
// Photos are the client's own, copied from design-excellence.ph into public/products/<slug>/.

export type ProductGroupId = "office-furniture" | "cabinets-closets";

export type ProductCategory = {
  slug: string;
  name: string;
  group: ProductGroupId;
  summary: string;
  types?: string[];
  /** First image leads. "contain" for product cut-outs on white, "cover" for room shots. */
  images: ProductImage[];
};

export type ProductImage = { src: string; alt: string; fit: "cover" | "contain" };

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
    images: [
      { src: "/products/chairs/1.jpg", alt: "Black leatherette high-back executive chair", fit: "contain" },
      { src: "/products/chairs/2.jpg", alt: "Black mesh visitor chair with a sled base", fit: "contain" },
      { src: "/products/chairs/3.jpg", alt: "Black leather lounge set with a glass coffee table", fit: "cover" },
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
    images: [
      { src: "/products/tables/1.jpg", alt: "Long conference table with black mesh chairs", fit: "cover" },
      { src: "/products/tables/2.jpg", alt: "Round meeting table with two mesh chairs", fit: "cover" },
      { src: "/products/tables/3.jpg", alt: "L-shaped wood executive table", fit: "contain" },
    ],
  },
  {
    slug: "workstations",
    name: "Workstations",
    group: "office-furniture",
    summary: "Desk systems for open offices, from a single desk to full clusters.",
    images: [
      { src: "/products/workstations/1.jpg", alt: "Workstation cluster with green desk screens and white storage", fit: "cover" },
      { src: "/products/workstations/2.jpg", alt: "Four-desk workstation in walnut with mesh chairs", fit: "cover" },
      { src: "/products/workstations/3.jpg", alt: "White bench workstation with blue screens and mobile pedestals", fit: "cover" },
    ],
  },
  {
    slug: "partitions",
    name: "Partitions",
    group: "office-furniture",
    summary: "Partitions that divide one floor into rooms and work areas.",
    images: [
      { src: "/products/partitions/1.jpg", alt: "Office pods divided by glass and green partition panels", fit: "cover" },
      { src: "/products/partitions/2.jpg", alt: "Frosted glass partition wall with a sliding door", fit: "cover" },
      { src: "/products/partitions/3.jpg", alt: "Open office divided by glass partitions", fit: "cover" },
    ],
  },
  {
    slug: "reception-area",
    name: "Reception Area",
    group: "office-furniture",
    summary: "Reception counters and seating for the people waiting.",
    images: [
      { src: "/products/reception-area/1.jpg", alt: "Reception counter with the Design Excellence logo", fit: "cover" },
      { src: "/products/reception-area/2.jpg", alt: "Glass-front reception counter with the DE mark", fit: "contain" },
      { src: "/products/reception-area/3.jpg", alt: "Two reception counter designs in light and dark wood", fit: "contain" },
    ],
  },
  {
    slug: "cabinets",
    name: "Metal Cabinets",
    group: "cabinets-closets",
    summary: "Metal storage and filing cabinets, made to your measurements.",
    images: [
      { src: "/products/cabinets/1.jpg", alt: "Mobile filing cabinets on rails, in light grey metal", fit: "contain" },
      { src: "/products/cabinets/2.jpg", alt: "White three-drawer mobile pedestal cabinet", fit: "contain" },
    ],
  },
  {
    slug: "kitchen-cabinets",
    name: "Modular Kitchen Cabinets",
    group: "cabinets-closets",
    summary: "Modular kitchen cabinets for homes and office pantries.",
    images: [
      { src: "/products/kitchen-cabinets/1.jpg", alt: "White modular kitchen with a timber breakfast bar and stools", fit: "cover" },
      { src: "/products/kitchen-cabinets/2.jpg", alt: "Dark kitchen cabinets with a grey stone counter", fit: "cover" },
      { src: "/products/kitchen-cabinets/3.jpg", alt: "Three white modular kitchen layouts", fit: "cover" },
    ],
  },
  {
    slug: "walk-in-closets",
    name: "Modular Walk‑in Closets", // non-breaking hyphen keeps "Walk-in" on one line
    group: "cabinets-closets",
    summary: "Modular walk-in closets fitted to the room.",
    images: [
      { src: "/products/walk-in-closets/1.jpg", alt: "White closet with mirrored sliding doors", fit: "cover" },
      { src: "/products/walk-in-closets/2.jpg", alt: "Walnut sliding closet open to shelves and hanging space", fit: "cover" },
      { src: "/products/walk-in-closets/3.jpg", alt: "Grey wood-grain wardrobe beside a built-in desk", fit: "cover" },
    ],
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
