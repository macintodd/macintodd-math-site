-- Run in a school-approved Supabase project's SQL editor.
create table if not exists public.slope_results (
  id uuid primary key,
  created_at timestamptz not null default now(),
  report jsonb not null,
  summary jsonb not null
);
alter table public.slope_results enable row level security;
revoke all on public.slope_results from anon, authenticated;
grant select, insert on public.slope_results to service_role;
-- No public policies. Only the server's service role can insert/read results.
-- The unique session ID makes a repeated save idempotent; it cannot overwrite a result.
