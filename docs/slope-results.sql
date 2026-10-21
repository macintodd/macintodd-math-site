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
-- Unique snapshot IDs make repeated saves idempotent; stored snapshots are immutable.

-- Immutable progress snapshots, one latest row per practice session.
-- Re-run this script to upgrade an existing results table.
create or replace view public.slope_latest_results
with (security_invoker = true) as
select distinct on (report->>'id') id, created_at, report, summary
from public.slope_results
order by report->>'id', (summary->>'attempts')::integer desc,
  coalesce((report->>'finished')::boolean, true) desc, created_at desc;
revoke all on public.slope_latest_results from anon, authenticated;
grant select on public.slope_latest_results to service_role;
