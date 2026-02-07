create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.cells (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users on delete cascade,
  name text not null,
  sector text,
  host_name text,
  meeting_day text,
  meeting_time text,
  status text default 'active',
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users on delete cascade,
  cell_id uuid references public.cells on delete set null,
  full_name text not null,
  role text default 'member',
  phone text,
  email text,
  status text default 'active',
  joined_at date,
  created_at timestamptz default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users on delete cascade,
  cell_id uuid references public.cells on delete set null,
  title text not null,
  event_date date not null,
  location text,
  event_type text default 'meeting',
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users on delete cascade,
  member_id uuid references public.members on delete set null,
  cell_id uuid references public.cells on delete set null,
  scheduled_at timestamptz,
  status text default 'pending',
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users on delete cascade,
  cell_id uuid references public.cells on delete set null,
  title text not null,
  due_date date,
  status text default 'pending',
  priority text default 'medium',
  assigned_to uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users on delete cascade,
  metric_date date not null,
  attendance int default 0,
  visitors int default 0,
  active_cells int default 0,
  followups int default 0,
  created_at timestamptz default now()
);

create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users on delete cascade,
  title text not null,
  status text default 'open',
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.public_stats (
  id uuid primary key default gen_random_uuid(),
  cells_active int default 0,
  participation_rate int default 0,
  new_visitors_60d int default 0,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.cells enable row level security;
alter table public.members enable row level security;
alter table public.events enable row level security;
alter table public.visits enable row level security;
alter table public.tasks enable row level security;
alter table public.metrics enable row level security;
alter table public.prayer_requests enable row level security;

create policy "profiles_select" on public.profiles for select
  using (id = auth.uid());

create policy "profiles_upsert" on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_update" on public.profiles for update
  using (id = auth.uid());

create policy "cells_owner" on public.cells for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "members_owner" on public.members for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "events_owner" on public.events for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "visits_owner" on public.visits for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "tasks_owner" on public.tasks for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "metrics_owner" on public.metrics for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "prayer_owner" on public.prayer_requests for all
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

alter table public.public_stats disable row level security;
grant select on public.public_stats to anon;
grant select on public.public_stats to authenticated;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
