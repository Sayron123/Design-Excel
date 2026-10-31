// The inquiry list: products and built cabinets a visitor wants priced. Shared by the browser
// (the list lives in localStorage) and the server (which re-checks it before saving).

export type InquiryItem = {
  id: string;
  kind: "product" | "builder";
  name: string;
  /** Model code, or the builder's choices, in one line. */
  detail?: string;
  qty: number;
  /** Where the item came from, so the list can link back to it. */
  href?: string;
};

export const FLOOR_PLAN_MAX_BYTES = 4 * 1024 * 1024;
export const FLOOR_PLAN_ACCEPT = ".pdf,.jpg,.jpeg,.png,.dwg";

export const MAX_ITEMS = 50;
export const MAX_QTY = 999;
const MAX_NAME = 120;
const MAX_DETAIL = 600;
const MAX_ID = 64;

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > 0 && text.length <= max ? text : null;
}

/**
 * Checks one item and returns a clean copy, or null if it is not a valid item. Links must be
 * site-relative, so a tampered list cannot plant an outside URL in the admin view.
 */
export function parseItem(raw: unknown): InquiryItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = cleanText(r.id, MAX_ID);
  const name = cleanText(r.name, MAX_NAME);
  if (!id || !name) return null;
  if (r.kind !== "product" && r.kind !== "builder") return null;
  if (typeof r.qty !== "number" || !Number.isInteger(r.qty) || r.qty < 1 || r.qty > MAX_QTY) return null;

  const item: InquiryItem = { id, kind: r.kind, name, qty: r.qty };
  if (r.detail !== undefined && r.detail !== "") {
    const detail = cleanText(r.detail, MAX_DETAIL);
    if (!detail) return null;
    item.detail = detail;
  }
  if (r.href !== undefined) {
    if (typeof r.href !== "string" || !/^\/[a-z0-9\-/#]*$/i.test(r.href) || r.href.length > 200) return null;
    item.href = r.href;
  }
  return item;
}

/** Strict: the whole list is rejected if any item is invalid or there are too many. */
export function parseItems(raw: unknown): InquiryItem[] | null {
  if (!Array.isArray(raw) || raw.length > MAX_ITEMS) return null;
  const items: InquiryItem[] = [];
  for (const entry of raw) {
    const item = parseItem(entry);
    if (!item) return null;
    items.push(item);
  }
  return items;
}

/** Lenient: keeps the valid items and drops the rest. For reading back what the browser stored. */
export function salvageItems(raw: unknown): InquiryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseItem).filter((i): i is InquiryItem => i !== null).slice(0, MAX_ITEMS);
}
