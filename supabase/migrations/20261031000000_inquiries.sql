-- Quote requests from the /inquire form, and a private bucket for attached floor plans.
-- Run this in the Supabase SQL editor, or with `npx supabase db push`.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  company text not null check (char_length(company) between 2 and 120),
  contact_person text not null check (char_length(contact_person) between 2 and 80),
  phone text not null check (char_length(phone) <= 30),
  email text not null check (char_length(email) <= 160),
  project_type text not null check (project_type in ('office', 'home')),
  items jsonb not null default '[]'::jsonb check (jsonb_typeof(items) = 'array'),
  notes text check (char_length(notes) <= 2000),
  floor_plan_path text,
  floor_plan_name text,
  status text not null default 'new' check (status in ('new', 'contacted', 'done'))
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- Row level security on with no policies: the anon and authenticated roles can do nothing.
-- The site's server uses the service role key, which bypasses RLS.
alter table public.inquiries enable row level security;

insert into storage.buckets (id, name, public, file_size_limit)
values ('floor-plans', 'floor-plans', false, 4194304)
on conflict (id) do nothing;
