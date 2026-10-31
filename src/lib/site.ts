// Shared site facts. Anything marked placeholder must be confirmed by the client before launch.

export const PHONE_DISPLAY = "0917 565 2796";
export const PHONE_TEL = "tel:+639175652796";

// Metro Manila landlines, from the client's old site.
export const LANDLINES = [
  { display: "(02) 3413-6682", tel: "tel:+63234136682" },
  { display: "(02) 7616-4044", tel: "tel:+63276164044" },
];

export const ADDRESS = "#1 Binmaka St. cor. Biak na Bato St., Brgy. Manresa, Quezon City";

// Corner of Binmaka and Biak na Bato streets (OpenStreetMap node 61718447).
export const SHOWROOM_LAT = 14.6406324;
export const SHOWROOM_LNG = 121.003147;
export const EMAIL = "designexcellence1@gmail.com";
export const FACEBOOK_URL = "https://www.facebook.com/designexcellence01";

export const INQUIRE_HREF = "/inquire";
export const INQUIRE_LABEL = "Inquire now";

// The cabinet builder (kitchen, wardrobe, walk-in closet).
export const BUILDER_HREF = "/products/modular-kitchen";

// Top-level navigation. "Products" opens the category menu (see lib/products.ts).
export const NAV_LINKS = [
  { id: "home", href: "/", label: "Home" },
  { id: "products", href: "/products", label: "Products" },
  { id: "how", href: "/#how-we-work", label: "How we work" },
  { id: "about", href: "/about", label: "About" },
  { id: "contact", href: INQUIRE_HREF, label: "Contact" },
] as const;

export type NavId = (typeof NAV_LINKS)[number]["id"];

// Footer links in two columns, each read top to bottom; home sections follow their order on the page.
export const FOOTER_LINKS: { href: string; label: string }[][] = [
  [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: BUILDER_HREF, label: "Build a cabinet" },
    { href: "/#how-we-work", label: "How we work" },
  ],
  [
    { href: "/about", label: "About" },
    { href: "/about#projects", label: "Projects" },
    { href: INQUIRE_HREF, label: "Contact" },
    { href: INQUIRE_HREF, label: INQUIRE_LABEL },
  ],
];
