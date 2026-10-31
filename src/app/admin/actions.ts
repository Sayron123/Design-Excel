"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, adminSessionToken, checkAdminPassword, isAdmin } from "@/lib/admin-session";
import { INQUIRY_STATUSES, getSupabase, type InquiryStatus } from "@/lib/supabase/server";

export type LoginState = { error?: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const attempt = formData.get("password");
  const token = adminSessionToken();
  if (!token) return { error: "The admin password is not set on the server." };
  if (typeof attempt !== "string" || !checkAdminPassword(attempt)) {
    // A short pause makes guessing slow without bothering the person who typed it wrong once.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "That password is not right." };
  }
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: ADMIN_MAX_AGE,
  });
  return {};
}

export async function signOut() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
}

/** Moves one inquiry to a new status. Checks the session itself: the page hiding the button is not enough. */
export async function updateStatus(id: string, status: InquiryStatus) {
  if (!(await isAdmin())) throw new Error("Not signed in");
  if (typeof id !== "string" || !UUID_RE.test(id)) throw new Error("Bad inquiry id");
  if (!INQUIRY_STATUSES.includes(status)) throw new Error("Bad status");
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("inquiries").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error("Status could not be saved");
  refresh();
}
