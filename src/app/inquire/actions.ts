"use server";

import { randomUUID } from "node:crypto";
import { FLOOR_PLAN_MAX_BYTES, parseItems } from "@/lib/inquiry-items";
import { FLOOR_PLAN_BUCKET, getSupabase } from "@/lib/supabase/server";

export type InquiryField = "company" | "contact" | "phone" | "email" | "projectType" | "items" | "notes" | "floorPlan";

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<InquiryField, string>> }
  | { status: "success"; reference: string };

// Accepted floor plan files, each checked by its first bytes as well as its name.
const FLOOR_PLAN_TYPES: Record<string, { mime: string; magic: number[] }> = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  png: { mime: "image/png", magic: [0x89, 0x50, 0x4e, 0x47] },
  jpg: { mime: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
  jpeg: { mime: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
  dwg: { mime: "application/acad", magic: [0x41, 0x43, 0x31, 0x30] }, // "AC10", every AutoCAD version
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

async function checkFloorPlan(file: File): Promise<{ ext: string; mime: string } | string> {
  if (file.size > FLOOR_PLAN_MAX_BYTES) return "The floor plan is over 4 MB. Send a smaller file, or email it to us.";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const type = FLOOR_PLAN_TYPES[ext];
  if (!type) return "Attach a PDF, JPG, PNG or DWG file.";
  const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (!type.magic.every((byte, i) => head[i] === byte)) return `This file is not a valid ${ext.toUpperCase()}.`;
  return { ext: ext === "jpeg" ? "jpg" : ext, mime: type.mime };
}

/** Saves a quote request. Every field is checked here; the browser's checks are only a convenience. */
export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // A field people never see. Bots fill it; they get a success screen and nothing is saved.
  if (text(formData, "website")) return { status: "success", reference: "received" };

  const company = text(formData, "company");
  const contact = text(formData, "contact");
  const phone = text(formData, "phone");
  const email = text(formData, "email");
  const projectType = text(formData, "projectType");
  const notes = text(formData, "notes");
  const fieldErrors: Partial<Record<InquiryField, string>> = {};

  if (company.length < 2 || company.length > 120) fieldErrors.company = "Enter your company or your name.";
  if (contact.length < 2 || contact.length > 80) fieldErrors.contact = "Enter the name of the person we should talk to.";
  const digits = phone.replace(/\D/g, "");
  if (!/^[\d\s+()\-.]+$/.test(phone) || digits.length < 7 || digits.length > 15)
    fieldErrors.phone = "Enter a phone number we can call, such as 0917 123 4567.";
  if (!EMAIL_RE.test(email) || email.length > 160) fieldErrors.email = "Enter an email address, such as name@company.com.";
  if (projectType !== "office" && projectType !== "home") fieldErrors.projectType = "Choose office or home.";
  if (notes.length > 2000) fieldErrors.notes = "Keep the notes under 2,000 characters.";

  let items = null;
  try {
    items = parseItems(JSON.parse(text(formData, "items") || "[]"));
  } catch {}
  if (!items) fieldErrors.items = "The item list could not be read. Remove the items and add them again.";

  const file = formData.get("floorPlan");
  let floorPlan: { file: File; ext: string; mime: string } | null = null;
  if (file instanceof File && file.size > 0) {
    const checked = await checkFloorPlan(file);
    if (typeof checked === "string") fieldErrors.floorPlan = checked;
    else floorPlan = { file, ...checked };
  }

  if (Object.keys(fieldErrors).length > 0 || !items) {
    return { status: "error", message: "Some details need another look.", fieldErrors };
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[inquiry] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
    return { status: "error", message: "Inquiries cannot be saved right now. Please call or email us instead.", fieldErrors: {} };
  }

  const id = randomUUID();
  let floorPlanPath: string | null = null;
  if (floorPlan) {
    floorPlanPath = `${new Date().getFullYear()}/${id}.${floorPlan.ext}`;
    const { error } = await supabase.storage
      .from(FLOOR_PLAN_BUCKET)
      .upload(floorPlanPath, floorPlan.file, { contentType: floorPlan.mime, upsert: false });
    if (error) {
      console.error("[inquiry] floor plan upload failed", error.message);
      return {
        status: "error",
        message: "The floor plan could not be uploaded. Try again, or send it without the file and email it to us.",
        fieldErrors: { floorPlan: "Upload failed." },
      };
    }
  }

  const { error } = await supabase.from("inquiries").insert({
    id,
    company,
    contact_person: contact,
    phone,
    email,
    project_type: projectType,
    items,
    notes: notes || null,
    floor_plan_path: floorPlanPath,
    // The visitor's own file name, trimmed to something safe to show.
    floor_plan_name: floorPlan ? floorPlan.file.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120) : null,
  });

  if (error) {
    console.error("[inquiry] insert failed", error.message);
    if (floorPlanPath) await supabase.storage.from(FLOOR_PLAN_BUCKET).remove([floorPlanPath]);
    return { status: "error", message: "Your inquiry could not be saved. Please try again in a minute.", fieldErrors: {} };
  }

  return { status: "success", reference: id.slice(0, 8).toUpperCase() };
}
