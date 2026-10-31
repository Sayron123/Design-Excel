import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// The admin page is behind one shared password (ADMIN_PASSWORD). Signing in stores an HMAC of a
// fixed message keyed by that password in an httpOnly cookie; changing the password signs
// everyone out. No password set means nobody can sign in.

export const ADMIN_COOKIE = "de_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 8; // one working day

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("design-excellence-admin-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** True when the password matches. Compared in constant time. */
export function checkAdminPassword(attempt: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Hash both sides so the comparison does not leak the password's length.
  const hash = (s: string) => createHmac("sha256", "admin-compare").update(s).digest("hex");
  return safeEqual(hash(attempt), hash(password));
}

export function adminSessionToken() {
  return expectedToken();
}

/** Reads the session cookie. Request-time only: call it inside a Suspense boundary or an action. */
export async function isAdmin() {
  const token = expectedToken();
  if (!token) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return typeof value === "string" && safeEqual(value, token);
}
