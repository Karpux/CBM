import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { createMember, deleteMember, fetchCells, fetchMembers, updateMember } from '../lib/api'
import { useAuth } from '../hooks/useAuth'

const emptyForm = {
  full_name: '',
  role: 'member',
  phone: '',
  email: '',
  status: 'active',
  cell_id: '',
}

export const Members = () => {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [cells, setCells] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cellFilter, setCellFilter] = useState('all')
  const [sortKey, setSortKey] = useState('full_name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const load = async () => {
    try {
      const [membersData, cellsData] = await Promise.all([fetchMembers(), fetchCells()])
      setMembers(membersData)
      setCells(cellsData)
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
    if (!form.full_name.trim() || !user) return
    const payload = {
      ...form,
      full_name: form.full_name.trim(),
      cell_id: form.cell_id || null,
    }
    try {
      if (editingId) {
        await updateMember({ id: editingId, ...payload })
      } else {
        await createMember({ ...payload, created_by: user.id })
      }
      setForm(emptyForm)
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (member) => {
    setEditingId(member.id)
    setForm({
      full_name: member.full_name || '',
      role: member.role || 'member',
      phone: member.phone || '',
      email: member.email || '',
      status: member.status || 'active',
      cell_id: member.cell_id || '',
    })
  }

  const handleDelete = async (id) => {
    try {
      await deleteMember(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const stats = useMemo(() => {
    const active = members.filter((member) => member.status === 'active').length
    const leaders = members.filter((member) => member.role === 'leader').length
    const hosts = members.filter((member) => member.role === 'host').length
    return { total: members.length, active, leaders, hosts }
  }, [members])

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return members.filter((member) => {
      const matchesRole = roleFilter === 'all' || member.role === roleFilter
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter
      const matchesCell = cellFilter === 'all' || member.cell_id === cellFilter
      const matchesTerm = !term || [member.full_name, member.email, member.phone]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
      return matchesRole && matchesStatus && matchesCell && matchesTerm
    })
  }, [members, search, roleFilter, statusFilter, cellFilter])

  const sortedMembers = useMemo(() => {
    const sorted = [...filteredMembers]
    sorted.sort((a, b) => {
      const valueA = (a[sortKey] || '').toString().toLowerCase()
      const valueB = (b[sortKey] || '').toString().toLowerCase()
      if (valueA < valueB) return sortDir === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredMembers, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sortedMembers.length / pageSize))
  const paginatedMembers = sortedMembers.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [search, roleFilter, statusFilter, cellFilter, pageSize])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const cellMap = useMemo(() => Object.fromEntries(cells.map((cell) => [cell.id, cell.name])), [cells])

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Gestión</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Miembros</h2>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="rounded-2xl border border-border bg-elevated p-4">
          <p className="text-xs font-semibold uppercase text-muted">Total</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-elevated p-4">
          <p className="text-xs font-semibold uppercase text-muted">Activos</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-border bg-elevated p-4">
          <p className="text-xs font-semibold uppercase text-muted">Líderes</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{stats.leaders}</p>
        </div>
        <div className="rounded-2xl border border-border bg-elevated p-4">
          <p className="text-xs font-semibold uppercase text-muted">Anfitriones</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{stats.hosts}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre, email o teléfono"
          className="flex-1 rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
        />
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
        >
          <option value="all">Todos los roles</option>
          <option value="member">Miembro</option>
          <option value="leader">Líder</option>
          <option value="host">Anfitrión</option>
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="paused">En pausa</option>
          <option value="inactive">Inactivo</option>
        </select>
        <select
          value={cellFilter}
          onChange={(event) => setCellFilter(event.target.value)}
          className="rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
        >
          <option value="all">Todas las células</option>
          {cells.map((cell) => (
            <option key={cell.id} value={cell.id}>{cell.name}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft lg:grid-cols-3">
        <label className="text-xs font-semibold uppercase text-muted">
          Nombre completo
          <input
            value={form.full_name}
            onChange={(event) => setForm({ ...form, full_name: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Rol
          <select
            value={form.role}
            onChange={(event) => setForm({ ...form, role: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          >
            <option value="member">Miembro</option>
            <option value="leader">Líder</option>
            <option value="host">Anfitrión</option>
          </select>
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Estado
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          >
            <option value="active">Activo</option>
            <option value="paused">En pausa</option>
            <option value="inactive">Inactivo</option>
          </select>
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Teléfono
          <input
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          />
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Email
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          />
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Célula
          <select
            value={form.cell_id}
            onChange={(event) => setForm({ ...form, cell_id: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
          >
            <option value="">Sin asignar</option>
            {cells.map((cell) => (
              <option key={cell.id} value={cell.id}>{cell.name}</option>
            ))}
          </select>
        </label>
        <div className="lg:col-span-3 flex items-center gap-3">
          <Button type="submit">{editingId ? 'Actualizar' : 'Crear miembro'}</Button>
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
      ) : filteredMembers.length === 0 ? (
        <EmptyState title="Sin miembros" subtitle="Registra personas para comenzar." />
      ) : (
        <div className="rounded-2xl border border-border bg-surface shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 text-xs text-muted">
            <div className="flex items-center gap-3">
              <span>{sortedMembers.length} resultados</span>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="rounded-full border border-border bg-elevated px-3 py-1 text-xs text-ink"
              >
                <option value={8}>8 por página</option>
                <option value={16}>16 por página</option>
                <option value={24}>24 por página</option>
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
                    <button type="button" onClick={() => handleSort('full_name')}>Nombre</button>
                  </th>
                  <th className="px-4 py-3">
                    <button type="button" onClick={() => handleSort('role')}>Rol</button>
                  </th>
                  <th className="px-4 py-3">Célula</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">
                    <button type="button" onClick={() => handleSort('status')}>Estado</button>
                  </th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{member.full_name}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">{member.role}</td>
                    <td className="px-4 py-3 text-muted">{cellMap[member.cell_id] || 'Sin asignar'}</td>
                    <td className="px-4 py-3 text-muted">{member.phone || 'Sin teléfono'} · {member.email || 'Sin email'}</td>
                    <td className="px-4 py-3">
                      <Badge tone={member.status === 'active' ? 'brand' : 'neutral'}>{member.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => handleEdit(member)}>Editar</Button>
                        <Button variant="soft" onClick={() => handleDelete(member.id)}>Eliminar</Button>
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
