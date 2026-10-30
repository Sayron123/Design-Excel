import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "Admin | Design Excellence", robots: { index: false } };

export default function AdminPage() {
  return <PlaceholderPage title="Admin" />;
}
