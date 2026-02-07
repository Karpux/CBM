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
  ('REPLACE_WITH_USER_ID', current_date, 312, 32, 48, 14);

-- Asignar rol admin al usuario
insert into public.user_roles (user_id, role_id)
select 'REPLACE_WITH_USER_ID', id from public.roles where name = 'admin';

insert into public.tasks (created_by, title, due_date, status, priority)
values
  ('REPLACE_WITH_USER_ID', 'Confirmar anfitrión para célula sector 3', current_date + interval '2 days', 'pending', 'high'),
  ('REPLACE_WITH_USER_ID', 'Asignar acompañamiento a familia Medina', current_date + interval '4 days', 'pending', 'medium'),
  ('REPLACE_WITH_USER_ID', 'Revisar agenda de visitas comunitarias', current_date + interval '1 day', 'pending', 'medium');

insert into public.events (created_by, title, event_date, location, event_type)
values
  ('REPLACE_WITH_USER_ID', 'Reunión general de líderes', current_date + interval '5 days', 'Centro CBM', 'meeting'),
  ('REPLACE_WITH_USER_ID', 'Visita a sector Norte', current_date + interval '7 days', 'Barrio Modelo', 'visit'),
  ('REPLACE_WITH_USER_ID', 'Capacitación de anfitriones', current_date + interval '12 days', 'Aula 2', 'training');

insert into public.prayer_requests (created_by, title, status, notes)
values
  ('REPLACE_WITH_USER_ID', 'Familia Rivera: salud y unidad', 'open', 'Acompañamiento semanal.'),
  ('REPLACE_WITH_USER_ID', 'Jóvenes Unidos: proyecto solidario', 'open', 'Plan de logística.'),
  ('REPLACE_WITH_USER_ID', 'Nuevos visitantes: bienvenida inicial', 'open', 'Asignar mentores.');
