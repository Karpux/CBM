create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  role_id uuid not null references public.roles on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, role_id)
);

alter table public.roles enable row level security;
alter table public.user_roles enable row level security;

create policy "roles_read_all" on public.roles
for select using (true);

create policy "user_roles_read_own" on public.user_roles
for select using (user_id = auth.uid());

create policy "user_roles_admin_all" on public.user_roles
for all
using (
  exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() and r.name = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() and r.name = 'admin'
  )
);

create or replace view public.v_user_roles as
select ur.user_id, r.name as role
from public.user_roles ur
join public.roles r on r.id = ur.role_id;

alter view public.v_user_roles set (security_invoker = on);

create index if not exists idx_cells_created_by on public.cells(created_by);
create index if not exists idx_members_created_by on public.members(created_by);
create index if not exists idx_events_created_by on public.events(created_by);
create index if not exists idx_tasks_created_by on public.tasks(created_by);
create index if not exists idx_metrics_created_by on public.metrics(created_by);
create index if not exists idx_prayer_created_by on public.prayer_requests(created_by);
