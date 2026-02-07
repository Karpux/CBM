import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../components/common/Badge'
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
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

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

  const stats = useMemo(() => {
    const active = cells.filter((cell) => cell.status === 'active').length
    const paused = cells.filter((cell) => cell.status === 'paused').length
    const closed = cells.filter((cell) => cell.status === 'closed').length
    return { total: cells.length, active, paused, closed }
  }, [cells])

  const filteredCells = useMemo(() => {
    const term = search.trim().toLowerCase()
    return cells.filter((cell) => {
      const matchesStatus = statusFilter === 'all' || cell.status === statusFilter
      const matchesTerm = !term || [cell.name, cell.sector, cell.host_name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
      return matchesStatus && matchesTerm
    })
  }, [cells, search, statusFilter])

  const sortedCells = useMemo(() => {
    const sorted = [...filteredCells]
    sorted.sort((a, b) => {
      const valueA = (a[sortKey] || '').toString().toLowerCase()
      const valueB = (b[sortKey] || '').toString().toLowerCase()
      if (valueA < valueB) return sortDir === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredCells, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sortedCells.length / pageSize))
  const paginatedCells = sortedCells.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, pageSize])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Gestión</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Células</h2>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="rounded-2xl border border-border bg-elevated p-4">
          <p className="text-xs font-semibold uppercase text-muted">Total</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-elevated p-4">
          <p className="text-xs font-semibold uppercase text-muted">Activas</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-border bg-elevated p-4">
          <p className="text-xs font-semibold uppercase text-muted">Pausadas / Cerradas</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{stats.paused + stats.closed}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre, sector o anfitrión"
          className="flex-1 rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
        >
          <option value="all">Todos</option>
          <option value="active">Activas</option>
          <option value="paused">Pausadas</option>
          <option value="closed">Cerradas</option>
        </select>
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
      ) : filteredCells.length === 0 ? (
        <EmptyState title="Sin células" subtitle="Crea la primera célula para comenzar." />
      ) : (
        <div className="rounded-2xl border border-border bg-surface shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 text-xs text-muted">
            <div className="flex items-center gap-3">
              <span>{sortedCells.length} resultados</span>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="rounded-full border border-border bg-elevated px-3 py-1 text-xs text-ink"
              >
                <option value={6}>6 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))}>Anterior</Button>
              <span>Página {page} de {totalPages}</span>
              <Button variant="outline" onClick={() => setPage(Math.min(totalPages, page + 1))}>Siguiente</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase text-muted">
                <tr className="border-b border-border">
                  <th className="px-4 py-3">
                    <button type="button" onClick={() => handleSort('name')}>
                      Nombre
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button type="button" onClick={() => handleSort('sector')}>
                      Sector
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button type="button" onClick={() => handleSort('host_name')}>
                      Anfitrión
                    </button>
                  </th>
                  <th className="px-4 py-3">Reunión</th>
                  <th className="px-4 py-3">
                    <button type="button" onClick={() => handleSort('status')}>
                      Estado
                    </button>
                  </th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCells.map((cell) => (
                  <tr key={cell.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{cell.name}</p>
                      {cell.notes ? <p className="text-xs text-muted">{cell.notes}</p> : null}
                    </td>
                    <td className="px-4 py-3 text-muted">{cell.sector || 'Sin sector'}</td>
                    <td className="px-4 py-3 text-muted">{cell.host_name || 'Sin anfitrión'}</td>
                    <td className="px-4 py-3 text-muted">{cell.meeting_day || 'Sin día'} {cell.meeting_time || ''}</td>
                    <td className="px-4 py-3">
                      <Badge tone={cell.status === 'active' ? 'brand' : 'neutral'}>{cell.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => handleEdit(cell)}>Editar</Button>
                        <Button variant="soft" onClick={() => handleDelete(cell.id)}>Eliminar</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
