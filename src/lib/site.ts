// Shared site facts. Anything marked placeholder must be confirmed by the client before launch.

export const PHONE_DISPLAY = "0917 565 2796";
export const PHONE_TEL = "tel:+639175652796";

export const ADDRESS = "#1 Binmaka St. cor. Biak na Bato St., Brgy. Manresa, Quezon City";

// Corner of Binmaka and Biak na Bato streets (OpenStreetMap node 61718447).
export const SHOWROOM_LAT = 14.6406324;
export const SHOWROOM_LNG = 121.003147;
export const EMAIL_PLACEHOLDER = "hello@example.com (placeholder)";
export const FACEBOOK_PLACEHOLDER = "#"; // placeholder: real Facebook page URL needed

// Quote basket count. Fixed at 0 until the quote form exists.
export const QUOTE_COUNT = 0;

// Top-level navigation. "Products" opens the category menu (see lib/products.ts).
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/#services", label: "Services" },
  { href: "/#how-we-work", label: "How we work" },
  { href: "/quote", label: "Contact" },
] as const;
