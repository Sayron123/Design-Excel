"use client";

import { useSyncExternalStore } from "react";
import { MAX_ITEMS, MAX_QTY, salvageItems, type InquiryItem } from "@/lib/inquiry-items";

// The visitor's inquiry list, kept in localStorage so it survives page loads. Storage can be
// missing or blocked (private windows, strict settings); every read and write is guarded, and the
// list then simply lasts for the visit.

const KEY = "de-inquiry-v1";
const CHANGE = "de-inquiry-change";
const EMPTY: InquiryItem[] = [];

// useSyncExternalStore needs the same array back until something changes.
let snapshot: InquiryItem[] | null = null;

function read(): InquiryItem[] {
  if (snapshot) return snapshot;
  try {
    const raw = window.localStorage.getItem(KEY);
    snapshot = raw ? salvageItems(JSON.parse(raw)) : EMPTY;
  } catch {
    snapshot = EMPTY;
  }
  return snapshot;
}

function write(items: InquiryItem[]) {
  snapshot = items;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable: the in-memory snapshot still holds the list for this visit.
  }
  window.dispatchEvent(new Event(CHANGE));
}

function subscribe(onChange: () => void) {
  // Another tab changed the list: drop the snapshot so the next read sees it.
  function onStorage(e: StorageEvent) {
    if (e.key !== null && e.key !== KEY) return;
    snapshot = null;
    onChange();
  }
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function newId() {
  // randomUUID needs a secure context; a phone testing over the LAN address has none.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    try {
      return crypto.randomUUID();
    } catch {}
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** The list, or an empty one during the server render and the first client render. */
export function useInquiry(): InquiryItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Total quantity across the list, for the header count. */
export function useInquiryCount() {
  return useInquiry().reduce((sum, item) => sum + item.qty, 0);
}

/** Adds an item, or raises the quantity of the same item already in the list. */
export function addToInquiry(item: Omit<InquiryItem, "id">) {
  const items = read();
  const same = items.find((i) => i.kind === item.kind && i.name === item.name && (i.detail ?? "") === (item.detail ?? ""));
  if (same) {
    write(items.map((i) => (i === same ? { ...i, qty: Math.min(MAX_QTY, i.qty + item.qty) } : i)));
    return true;
  }
  if (items.length >= MAX_ITEMS) return false;
  write([...items, { ...item, id: newId() }]);
  return true;
}

export function setInquiryQty(id: string, qty: number) {
  const clamped = Math.max(1, Math.min(MAX_QTY, Math.round(qty) || 1));
  write(read().map((i) => (i.id === id ? { ...i, qty: clamped } : i)));
}

export function removeFromInquiry(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function clearInquiry() {
  write(EMPTY);
}
