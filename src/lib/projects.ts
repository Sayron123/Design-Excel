// Accomplished projects, copied from the client's old site (designexcellence.weebly.com/about-us.html)
// into public/projects/<group>/. The old site gives no client names or years, so none are shown.

import type { ProductImage } from "@/lib/products";

export type ProjectGroupId = "office" | "home";

export type ProjectImage = Pick<ProductImage, "src" | "alt">;

export const PROJECT_GROUPS: { id: ProjectGroupId; name: string; summary: string; images: ProjectImage[] }[] = [
  {
    id: "office",
    name: "Office systems",
    summary: "Workstations, partitions, executive desks, boardrooms and training rooms, installed on site.",
    images: [
      { src: "/projects/office/open-plan-office.jpg", alt: "Open-plan office floor with grey panel workstations in use" },
      { src: "/projects/office/call-centre-floor.jpg", alt: "Long rows of green-panel workstations across a call centre floor" },
      { src: "/projects/office/blue-panel-workstations.jpg", alt: "Blue fabric panel workstations with aluminium frames" },
      { src: "/projects/office/green-panel-workstations.jpg", alt: "Green and white cluster workstations with task chairs" },
      { src: "/projects/office/glass-top-partition.jpg", alt: "Workstation with a frosted glass partition top and mesh chair" },
      { src: "/projects/office/l-shaped-workstations.jpg", alt: "L-shaped white desks between grey partitions" },
      { src: "/projects/office/bench-desks.jpg", alt: "Bench desks with a green desk-mounted screen" },
      { src: "/projects/office/executive-desk.jpg", alt: "Mahogany executive desk with a wall shelf behind it" },
      { src: "/projects/office/glass-executive-desk.jpg", alt: "Glass-top executive desk with two visitor chairs" },
      { src: "/projects/office/white-glass-desk.jpg", alt: "White glass desk with a pedestal and a white high-back chair" },
      { src: "/projects/office/boardroom-table.jpg", alt: "Dark wood boardroom table by a window over the city" },
      { src: "/projects/office/conference-room.jpg", alt: "Conference table with new chairs still in their plastic" },
      { src: "/projects/office/white-meeting-table.jpg", alt: "White meeting table with grey upholstered chairs" },
      { src: "/projects/office/training-tables.jpg", alt: "Folding training tables in a square with coloured chairs" },
      { src: "/projects/office/training-chairs.jpg", alt: "Rows of training chairs with blue seats" },
    ],
  },
  {
    id: "home",
    name: "Home furnishing",
    summary: "Kitchens, quartz countertops, vanities and feature walls, made to the room.",
    images: [
      { src: "/projects/home/red-gloss-kitchen.jpg", alt: "Red high-gloss kitchen with a white breakfast bar" },
      { src: "/projects/home/red-u-shaped-kitchen.jpg", alt: "U-shaped kitchen with red gloss cabinets and a white counter" },
      { src: "/projects/home/white-island-kitchen.jpg", alt: "White kitchen with a long island and a black base" },
      { src: "/projects/home/dark-wood-kitchen.jpg", alt: "Dark wood kitchen island under pendant lights" },
      { src: "/projects/home/yellow-island-kitchen.jpg", alt: "Kitchen with a yellow island counter and pendant lights" },
      { src: "/projects/home/wood-kitchen.jpg", alt: "Light wood kitchen with a brown quartz island top" },
      { src: "/projects/home/quartz-l-counter.jpg", alt: "L-shaped grey quartz counter over white handleless cabinets" },
      { src: "/projects/home/quartz-counter-detail.jpg", alt: "Grey quartz countertop and backsplash" },
      { src: "/projects/home/quartz-island.jpg", alt: "White quartz island top on a wood-finish base" },
      { src: "/projects/home/double-vanity.jpg", alt: "Double vanity with vessel basins on a black counter" },
      { src: "/projects/home/lit-vanity.jpg", alt: "Vanity basin with a lit shelf along the wall" },
      { src: "/projects/home/powder-room.jpg", alt: "Powder room with a floating vanity and a lit shelf" },
      { src: "/projects/home/vanity-cabinet.jpg", alt: "Vanity cabinet with a basin and a tall open shelf" },
      { src: "/projects/home/bathtub-surround.jpg", alt: "Built-in bathtub surround with a step" },
      { src: "/projects/home/tree-feature-wall.jpg", alt: "Wood feature wall with a white branching tree cut-out" },
    ],
  },
];
