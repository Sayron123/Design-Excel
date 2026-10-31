import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/admin/actions";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { StatusControl } from "@/components/admin/StatusControl";
import { buttonClass } from "@/components/ui/button";
import { isAdmin, isAdminConfigured } from "@/lib/admin-session";
import { FLOOR_PLAN_BUCKET, INQUIRY_STATUSES, getSupabase, type InquiryRow, type InquiryStatus } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin | Design Excellence", robots: { index: false, follow: false } };

const STATUS_LABEL: Record<InquiryStatus, string> = { new: "New", contacted: "Contacted", done: "Done" };

const received = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" });

const contactLink = "font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-ink";

function Notice({ children }: { children: React.ReactNode }) {
  return <p className="mt-8 max-w-[52ch] rounded-xl bg-surface p-6 text-base leading-relaxed text-ink">{children}</p>;
}

async function Inquiries({ filter }: { filter: InquiryStatus | null }) {
  const supabase = getSupabase();
  if (!supabase) return <Notice>Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server to load quote requests.</Notice>;

  const { data, error } = await supabase
    .from("inquiries")
    .select("id, created_at, company, contact_person, phone, email, project_type, items, notes, floor_plan_path, floor_plan_name, status")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return <Notice>Quote requests could not be loaded: {error.message}</Notice>;

  const rows = (data ?? []) as InquiryRow[];
  const counts = Object.fromEntries(INQUIRY_STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length])) as Record<InquiryStatus, number>;
  const shown = filter ? rows.filter((r) => r.status === filter) : rows;

  // Floor plans sit in a private bucket; links are signed for an hour.
  const paths = shown.map((r) => r.floor_plan_path).filter((p): p is string => Boolean(p));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data: urls } = await supabase.storage.from(FLOOR_PLAN_BUCKET).createSignedUrls(paths, 3600);
    urls?.forEach((u) => u.path && u.signedUrl && signed.set(u.path, u.signedUrl));
  }

  const tab = (active: boolean) =>
    `inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-[14px] font-semibold transition-colors ${
      active ? "bg-ink text-white" : "text-ink hover:bg-border"
    }`;

  return (
    <>
      <nav aria-label="Filter by status" className="mt-8 flex flex-wrap gap-1">
        <Link href="/admin" className={tab(filter === null)} aria-current={filter === null ? "page" : undefined}>
          All <span className="tabular-nums opacity-70">{rows.length}</span>
        </Link>
        {INQUIRY_STATUSES.map((s) => (
          <Link key={s} href={`/admin?status=${s}`} className={tab(filter === s)} aria-current={filter === s ? "page" : undefined}>
            {STATUS_LABEL[s]} <span className="tabular-nums opacity-70">{counts[s]}</span>
          </Link>
        ))}
      </nav>

      {/* An app screen: rows are separated by rules, as in a table. */}
      <div data-ui className="mt-4 rounded-xl bg-surface">
        {shown.length === 0 ? (
          <p className="p-6 text-base text-muted">{filter ? `No ${STATUS_LABEL[filter].toLowerCase()} quote requests.` : "No quote requests yet."}</p>
        ) : (
          <ul>
            {shown.map((r) => (
              <li key={r.id} /* table row rule, taste-skill-ignore */ className="grid gap-4 border-b border-border p-5 last:border-b-0 md:grid-cols-12 md:gap-6 md:p-6">
                <div className="md:col-span-4">
                  <h2 className="text-lg font-bold tracking-tight text-ink">{r.company}</h2>
                  <p className="text-base text-ink">{r.contact_person}</p>
                  <p className="mt-2 flex flex-col gap-1 text-[14px]">
                    <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className={contactLink}>
                      {r.phone}
                    </a>
                    <a href={`mailto:${r.email}`} className={`${contactLink} break-all`}>
                      {r.email}
                    </a>
                  </p>
                </div>

                <div className="min-w-0 md:col-span-5">
                  {r.items.length > 0 ? (
                    <ul className="space-y-1.5">
                      {r.items.map((item) => (
                        <li key={item.id} className="text-[14px] leading-snug text-ink">
                          <span className="font-semibold tabular-nums">{item.qty} ×</span> <span className="font-semibold">{item.name}</span>
                          {item.kind === "builder" && <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[12px] font-semibold text-primary">Builder</span>}
                          {item.detail && <span className="block text-muted">{item.detail}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[14px] text-muted">No items listed</p>
                  )}
                  {r.notes && <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-ink">{r.notes}</p>}
                  {r.floor_plan_path && (
                    <p className="mt-3 text-[14px]">
                      {signed.get(r.floor_plan_path) ? (
                        <a href={signed.get(r.floor_plan_path)} target="_blank" rel="noopener noreferrer" className={contactLink}>
                          Floor plan: {r.floor_plan_name ?? "download"}
                        </a>
                      ) : (
                        <span className="text-muted">Floor plan attached, link unavailable</span>
                      )}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2 md:col-span-3 md:items-end md:text-right">
                  <StatusControl id={r.id} status={r.status} company={r.company} />
                  <p className="text-[14px] text-muted">
                    {r.project_type === "office" ? "Office" : "Home"} · {received.format(new Date(r.created_at))}
                  </p>
                  <p className="text-[13px] tabular-nums text-muted">Ref {r.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

async function AdminContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!isAdminConfigured()) return <Notice>Set ADMIN_PASSWORD on the server to open this page.</Notice>;
  if (!(await isAdmin())) return <AdminLogin />;

  const raw = (await searchParams).status;
  const filter = INQUIRY_STATUSES.find((s) => s === raw) ?? null;

  return (
    <>
      <form action={signOut} className="mt-4">
        <button type="submit" className={buttonClass("secondary", "sm")}>
          Sign out
        </button>
      </form>
      <Inquiries filter={filter} />
    </>
  );
}

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight">Quote requests</h1>
      <Suspense fallback={<p className="mt-8 text-base text-muted">Loading…</p>}>
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
