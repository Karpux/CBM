import { BarChart3, BookOpen, Calendar, HandHeart, ListChecks, Shield, Users } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { BarChart } from '../components/common/BarChart'
import { EmptyState } from '../components/common/EmptyState'
import { KpiCard } from '../components/common/KpiCard'
import { Panel } from '../components/common/Panel'
import { EventForm } from '../components/dashboard/EventForm'
import { MetricsForm } from '../components/dashboard/MetricsForm'
import { TaskForm } from '../components/dashboard/TaskForm'
import { useDashboardData } from '../hooks/useDashboardData'
import { formatDate } from '../lib/format'
import { createEvent, createMetrics, createTask, deleteEvent, deleteTask, updateTaskStatus } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

const tools = [
  { icon: Users, label: 'Mapeo de células', detail: 'Cobertura barrial por zonas' },
  { icon: ListChecks, label: 'Checklist pastoral', detail: 'Rutinas semanales y quincenales' },
  { icon: HandHeart, label: 'Acciones solidarias', detail: 'Proyectos y seguimiento' },
  { icon: BarChart3, label: 'Métricas vivas', detail: 'Insights diarios' },
  { icon: BookOpen, label: 'Formación', detail: 'Rutas discipulares' },
  { icon: Shield, label: 'Cumplimiento', detail: 'Roles y permisos' },
]

export const Dashboard = () => {
  const { metrics, tasks, events, visits, prayer, loading, error, refresh } = useDashboardData()
  const { user } = useAuth()
  const [actionError, setActionError] = useState('')

  const openVisits = visits.filter((visit) => visit.status !== 'done').length
  const openPrayer = prayer.filter((item) => item.status !== 'closed').length

  const metricCards = [
    { label: 'Asistencia semanal', value: metrics?.attendance ?? 0, trend: 'Actualizado' },
    { label: 'Seguimientos críticos', value: metrics?.followups ?? openVisits, trend: 'En revisión' },
    { label: 'Visitantes nuevos', value: metrics?.visitors ?? 0, trend: 'Esta semana' },
    { label: 'Células activas', value: metrics?.active_cells ?? 0, trend: 'En operación' },
  ]

  const taskStatusData = [
    { label: 'Pendientes', value: tasks.filter((task) => task.status !== 'done').length, color: 'rgb(42 125 112)' },
    { label: 'Completadas', value: tasks.filter((task) => task.status === 'done').length, color: 'rgb(216 150 66)' },
  ]

  const eventTypeData = [
    { label: 'Reuniones', value: events.filter((event) => event.event_type === 'meeting').length, color: 'rgb(42 125 112)' },
    { label: 'Visitas', value: events.filter((event) => event.event_type === 'visit').length, color: 'rgb(216 150 66)' },
    { label: 'Formación', value: events.filter((event) => event.event_type === 'training').length, color: 'rgb(72 133 185)' },
  ]

  const handleCreateTask = async (payload) => {
    if (!user) return
    try {
      await createTask({ ...payload, created_by: user.id })
      setActionError('')
      await refresh()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleToggleTask = async (task) => {
    const nextStatus = task.status === 'done' ? 'pending' : 'done'
    try {
      await updateTaskStatus({ id: task.id, status: nextStatus })
      setActionError('')
      await refresh()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id)
      setActionError('')
      await refresh()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleCreateEvent = async (payload) => {
    if (!user) return
    try {
      await createEvent({ ...payload, created_by: user.id })
      setActionError('')
      await refresh()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id)
      setActionError('')
      await refresh()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleCreateMetrics = async (payload) => {
    if (!user) return
    try {
      await createMetrics({ ...payload, created_by: user.id })
      setActionError('')
      await refresh()
    } catch (err) {
      setActionError(err.message)
    }
  }

  return (
    <section className="space-y-8">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}
        {actionError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
            {actionError}
          </div>
        ) : null}
        <section className="grid gap-4 lg:grid-cols-4">
          {metricCards.map((metric, index) => (
            <KpiCard
              key={metric.label}
              label={metric.label}
              value={loading ? '...' : metric.value}
              trend={metric.trend}
              delay={index * 0.06}
            />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Agenda estratégica" description="Lo crítico para esta semana">
            <TaskForm onCreate={handleCreateTask} />
            {tasks.length === 0 ? (
              <EmptyState title="Sin tareas aún" subtitle="Crea tareas desde el módulo de seguimiento." />
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-elevated px-4 py-3">
                  <span className="text-sm text-ink">{task.title}</span>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs font-semibold text-brand"
                      onClick={() => handleToggleTask(task)}
                      type="button"
                    >
                      {task.status === 'done' ? 'Reabrir' : 'Completar'}
                    </button>
                    <button
                      className="text-xs font-semibold text-red-500"
                      onClick={() => handleDeleteTask(task.id)}
                      type="button"
                    >
                      Eliminar
                    </button>
                    <Badge tone="brand">{task.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </Panel>
          <Panel title="Próximos eventos" description="Actividades confirmadas">
            <EventForm onCreate={handleCreateEvent} />
            {events.length === 0 ? (
              <EmptyState title="Sin eventos" subtitle="Agenda nuevas reuniones o capacitaciones." />
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-elevated px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{event.title}</p>
                    <p className="text-xs text-muted">{event.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs font-semibold text-red-500"
                      onClick={() => handleDeleteEvent(event.id)}
                      type="button"
                    >
                      Eliminar
                    </button>
                    <Badge tone="accent">{formatDate(event.event_date)}</Badge>
                  </div>
                </div>
              ))
            )}
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Panel title="Asistencia y cuidado" description="Tendencias clave">
            <MetricsForm onCreate={handleCreateMetrics} />
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Asistencia global</span>
              <span>{metrics?.attendance ?? 0}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border">
              <div className="h-2 w-[88%] rounded-full bg-brand" />
            </div>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Visitantes nuevos</span>
              <span>{metrics?.visitors ?? 0}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border">
              <div className="h-2 w-[62%] rounded-full bg-accent" />
            </div>
          </Panel>
          <Panel title="Alertas de seguimiento" description="Personas y células">
            <div className="rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-ink">
              {openVisits} visitas pendientes.
            </div>
            <div className="rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-ink">
              {openPrayer} pedidos de oración activos.
            </div>
            <div className="rounded-xl border border-border bg-elevated px-4 py-3 text-sm text-ink">
              {tasks.length} tareas abiertas.
            </div>
          </Panel>
          <Panel title="Recursos y materiales" description="Biblioteca viva">
            <div className="flex items-center justify-between text-sm">
              <span>Serie: Barrio con propósito</span>
              <Badge tone="neutral">6 semanas</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Guía de anfitriones</span>
              <Badge tone="neutral">Actualizada</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Plan de oración 21 días</span>
              <Badge tone="neutral">PDF</Badge>
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Estado de tareas" description="Distribución actual">
            <BarChart data={taskStatusData} />
          </Panel>
          <Panel title="Tipos de eventos" description="Resumen operativo">
            <BarChart data={eventTypeData} />
          </Panel>
        </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {tools.map((tool) => (
          <div key={tool.label} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <tool.icon className="text-brand" size={20} />
            <h3 className="mt-4 text-lg font-semibold text-ink">{tool.label}</h3>
            <p className="mt-2 text-sm text-muted">{tool.detail}</p>
          </div>
        ))}
      </section>

        <section className="rounded-3xl bg-hero p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Resumen pastoral</p>
              <h2 className="mt-3 font-display text-2xl text-ink">Plan semanal listo para ejecutarse</h2>
              <p className="mt-2 text-sm text-muted">
                Tareas abiertas: {tasks.length}. Visitas pendientes: {openVisits}. Oración activa: {openPrayer}.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="brand">{metrics?.attendance ?? 0} asistentes</Badge>
              <Badge tone="accent">{metrics?.visitors ?? 0} visitantes</Badge>
            </div>
          </div>
        </section>
    </section>
  )
}
