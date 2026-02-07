import { supabase } from './supabaseClient'

export const fetchPublicStats = async () => {
  const { data, error } = await supabase
    .from('public_stats')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export const fetchDashboardSnapshot = async () => {
  const metricsQuery = supabase
    .from('metrics')
    .select('*')
    .order('metric_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  const tasksQuery = supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true })
    .limit(6)

  const eventsQuery = supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
    .limit(6)

  const visitsQuery = supabase
    .from('visits')
    .select('status')
    .order('created_at', { ascending: false })
    .limit(200)

  const prayerQuery = supabase
    .from('prayer_requests')
    .select('status')
    .order('created_at', { ascending: false })
    .limit(200)

  const [metricsRes, tasksRes, eventsRes, visitsRes, prayerRes] = await Promise.all([
    metricsQuery,
    tasksQuery,
    eventsQuery,
    visitsQuery,
    prayerQuery,
  ])

  if (metricsRes.error) throw metricsRes.error
  if (tasksRes.error) throw tasksRes.error
  if (eventsRes.error) throw eventsRes.error
  if (visitsRes.error) throw visitsRes.error
  if (prayerRes.error) throw prayerRes.error

  return {
    metrics: metricsRes.data,
    tasks: tasksRes.data ?? [],
    events: eventsRes.data ?? [],
    visits: visitsRes.data ?? [],
    prayer: prayerRes.data ?? [],
  }
}

export const createTask = async (payload) => {
  const { data, error } = await supabase.from('tasks').insert(payload).select().single()
  if (error) throw error
  return data
}

export const updateTaskStatus = async ({ id, status }) => {
  const { data, error } = await supabase.from('tasks').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteTask = async (id) => {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

export const createEvent = async (payload) => {
  const { data, error } = await supabase.from('events').insert(payload).select().single()
  if (error) throw error
  return data
}

export const deleteEvent = async (id) => {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}

export const createMetrics = async (payload) => {
  const { data, error } = await supabase.from('metrics').insert(payload).select().single()
  if (error) throw error
  return data
}

export const fetchCells = async () => {
  const { data, error } = await supabase.from('cells').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export const createCell = async (payload) => {
  const { data, error } = await supabase.from('cells').insert(payload).select().single()
  if (error) throw error
  return data
}

export const updateCell = async ({ id, ...payload }) => {
  const { data, error } = await supabase.from('cells').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteCell = async (id) => {
  const { error } = await supabase.from('cells').delete().eq('id', id)
  if (error) throw error
}

export const fetchMembers = async () => {
  const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export const createMember = async (payload) => {
  const { data, error } = await supabase.from('members').insert(payload).select().single()
  if (error) throw error
  return data
}

export const updateMember = async ({ id, ...payload }) => {
  const { data, error } = await supabase.from('members').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export const deleteMember = async (id) => {
  const { error } = await supabase.from('members').delete().eq('id', id)
  if (error) throw error
}

export const fetchRoles = async () => {
  const { data, error } = await supabase.from('roles').select('*').order('name')
  if (error) throw error
  return data ?? []
}

export const fetchUserRoles = async () => {
  const { data, error } = await supabase.from('user_roles').select('id, user_id, role_id, roles(name)')
  if (error) throw error
  return data ?? []
}

export const assignUserRole = async (payload) => {
  const { data, error } = await supabase.from('user_roles').insert(payload).select().single()
  if (error) throw error
  return data
}

export const deleteUserRole = async (id) => {
  const { error } = await supabase.from('user_roles').delete().eq('id', id)
  if (error) throw error
}
