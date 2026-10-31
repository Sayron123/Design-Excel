import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { InquiryItem } from "@/lib/inquiry-items";

// Server-only Supabase client with the service role key. The inquiries table has row level
// security on and no policies, so only this client (never the browser) can read or write it.

export const FLOOR_PLAN_BUCKET = "floor-plans";

export const INQUIRY_STATUSES = ["new", "contacted", "done"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export type InquiryRow = {
  id: string;
  created_at: string;
  company: string;
  contact_person: string;
  phone: string;
  email: string;
  project_type: "office" | "home";
  items: InquiryItem[];
  notes: string | null;
  floor_plan_path: string | null;
  floor_plan_name: string | null;
  status: InquiryStatus;
};

let client: SupabaseClient | null = null;

/** Null when the Supabase variables are not set, so callers can show a plain message. */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
