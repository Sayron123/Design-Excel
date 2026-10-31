// Cabinet builder options. Every finish and countertop name here is a placeholder: the client's
// real laminate and quartz ranges replace them before launch. Colours are close stand-ins.

export type CabinetTypeId = "kitchen" | "wardrobe" | "walk-in";

export type CabinetType = {
  id: CabinetTypeId;
  name: string;
  summary: string;
  /** Width range in metres, and where the slider starts. */
  min: number;
  max: number;
  start: number;
  /** Width of one door or bay, used to divide the drawing. */
  module: number;
  href: string;
};

export const CABINET_TYPES: CabinetType[] = [
  {
    id: "kitchen",
    name: "Kitchen cabinet",
    summary: "Base and wall cabinets with a quartz countertop.",
    min: 1.2,
    max: 6,
    start: 2.4,
    module: 0.6,
    href: "/products/kitchen-cabinets",
  },
  {
    id: "wardrobe",
    name: "Wardrobe",
    summary: "Full-height doors over hanging space, shelves and drawers.",
    min: 0.9,
    max: 4,
    start: 1.8,
    module: 0.45,
    href: "/products/walk-in-closets",
  },
  {
    id: "walk-in",
    name: "Walk‑in closet", // non-breaking hyphen
    summary: "Open bays of hanging rails, shelves and drawers along a wall.",
    min: 1.8,
    max: 6,
    start: 2.7,
    module: 0.9,
    href: "/products/walk-in-closets",
  },
];

export type Swatch = { id: string; name: string; color: string };

export const FINISHES: Swatch[] = [
  { id: "warm-white", name: "Warm white", color: "#f2efe8" },
  { id: "light-oak", name: "Light oak", color: "#cfae7f" },
  { id: "walnut", name: "Walnut", color: "#6e4a32" },
  { id: "sage", name: "Sage", color: "#9aa78f" },
  { id: "navy", name: "Navy", color: "#25395a" },
  { id: "charcoal", name: "Charcoal", color: "#3a3d42" },
];

export const COUNTERTOPS: Swatch[] = [
  { id: "quartz-snow", name: "Snow quartz", color: "#f4f4f1" },
  { id: "quartz-veined", name: "Veined white quartz", color: "#e4e1db" },
  { id: "quartz-grey", name: "Concrete grey quartz", color: "#a3a3a0" },
  { id: "quartz-black", name: "Black quartz", color: "#26272a" },
];

export const PLACEHOLDER = "placeholder";

export function getCabinetType(id: string) {
  return CABINET_TYPES.find((t) => t.id === id);
}

/** Widths step by 10cm; the value is rounded so the drawing and the summary agree. */
export function clampWidth(type: CabinetType, metres: number) {
  return Math.round(Math.min(type.max, Math.max(type.min, metres)) * 10) / 10;
}
