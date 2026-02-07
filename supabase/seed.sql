insert into public.public_stats (cells_active, participation_rate, new_visitors_60d)
values (48, 92, 124);

insert into public.roles (name, description) values
  ('admin', 'Control total de la plataforma'),
  ('leader', 'Lidera células y métricas'),
  ('host', 'Anfitrión de reuniones'),
  ('viewer', 'Solo lectura')
on conflict (name) do nothing;

-- Reemplaza REPLACE_WITH_USER_ID por el UUID real de auth.users
insert into public.metrics (created_by, metric_date, attendance, visitors, active_cells, followups)
values
  ('820167bb-fec3-45cf-9f07-5926c5875293', current_date, 312, 32, 48, 14);

-- Asignar rol admin al usuario
insert into public.user_roles (user_id, role_id)
select '820167bb-fec3-45cf-9f07-5926c5875293', id from public.roles where name = 'admin';

insert into public.tasks (created_by, title, due_date, status, priority)
values
  ('820167bb-fec3-45cf-9f07-5926c5875293', 'Confirmar anfitrión para célula sector 3', current_date + interval '2 days', 'pending', 'high'),
  ('820167bb-fec3-45cf-9f07-5926c5875293', 'Asignar acompañamiento a familia Medina', current_date + interval '4 days', 'pending', 'medium'),
  ('820167bb-fec3-45cf-9f07-5926c5875293', 'Revisar agenda de visitas comunitarias', current_date + interval '1 day', 'pending', 'medium');

insert into public.events (created_by, title, event_date, location, event_type)
values
  ('820167bb-fec3-45cf-9f07-5926c5875293', 'Reunión general de líderes', current_date + interval '5 days', 'Centro CBM', 'meeting'),
  ('820167bb-fec3-45cf-9f07-5926c5875293', 'Visita a sector Norte', current_date + interval '7 days', 'Barrio Modelo', 'visit'),
  ('820167bb-fec3-45cf-9f07-5926c5875293', 'Capacitación de anfitriones', current_date + interval '12 days', 'Aula 2', 'training');

insert into public.prayer_requests (created_by, title, status, notes)
values
  ('820167bb-fec3-45cf-9f07-5926c5875293', 'Familia Rivera: salud y unidad', 'open', 'Acompañamiento semanal.'),
  ('820167bb-fec3-45cf-9f07-5926c5875293', 'Jóvenes Unidos: proyecto solidario', 'open', 'Plan de logística.'),
  ('820167bb-fec3-45cf-9f07-5926c5875293', 'Nuevos visitantes: bienvenida inicial', 'open', 'Asignar mentores.');
