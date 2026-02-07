import { useEffect, useState } from 'react'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { createCell, deleteCell, fetchCells, updateCell } from '../lib/api'
import { useAuth } from '../hooks/useAuth'

const emptyForm = {
  name: '',
  sector: '',
  host_name: '',
  meeting_day: '',
  meeting_time: '',
  status: 'active',
  notes: '',
}

export const Cells = () => {
  const { user } = useAuth()
  const [cells, setCells] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const data = await fetchCells()
      setCells(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !user) return
    try {
      if (editingId) {
        await updateCell({ id: editingId, ...form })
      } else {
        await createCell({ ...form, created_by: user.id })
      }
      setForm(emptyForm)
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (cell) => {
    setEditingId(cell.id)
    setForm({
      name: cell.name || '',
      sector: cell.sector || '',
      host_name: cell.host_name || '',
      meeting_day: cell.meeting_day || '',
      meeting_time: cell.meeting_time || '',
      status: cell.status || 'active',
      notes: cell.notes || '',
    })
  }

  const handleDelete = async (id) => {
    try {
      await deleteCell(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Gestión</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Células</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft lg:grid-cols-3">
        <label className="text-xs font-semibold uppercase text-muted">
          Nombre
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Sector
          <input
            value={form.sector}
            onChange={(event) => setForm({ ...form, sector: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          />
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Anfitrión
          <input
            value={form.host_name}
            onChange={(event) => setForm({ ...form, host_name: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          />
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Día de reunión
          <input
            value={form.meeting_day}
            onChange={(event) => setForm({ ...form, meeting_day: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          />
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Hora
          <input
            value={form.meeting_time}
            onChange={(event) => setForm({ ...form, meeting_time: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          />
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Estado
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          >
            <option value="active">Activa</option>
            <option value="paused">Pausada</option>
            <option value="closed">Cerrada</option>
          </select>
        </label>
        <label className="text-xs font-semibold uppercase text-muted lg:col-span-3">
          Notas
          <textarea
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
            rows={3}
          />
        </label>
        <div className="lg:col-span-3 flex items-center gap-3">
          <Button type="submit">{editingId ? 'Actualizar' : 'Crear célula'}</Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm) }}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-sm text-muted">Cargando...</div>
      ) : cells.length === 0 ? (
        <EmptyState title="Sin células" subtitle="Crea la primera célula para comenzar." />
      ) : (
        <div className="grid gap-4">
          {cells.map((cell) => (
            <div key={cell.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{cell.name}</p>
                  <p className="text-xs text-muted">{cell.sector || 'Sin sector'} · {cell.meeting_day || 'Sin día'} {cell.meeting_time || ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => handleEdit(cell)}>Editar</Button>
                  <Button variant="soft" onClick={() => handleDelete(cell.id)}>Eliminar</Button>
                </div>
              </div>
              {cell.notes ? <p className="mt-3 text-xs text-muted">{cell.notes}</p> : null}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
