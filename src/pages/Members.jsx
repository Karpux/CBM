import { useEffect, useState } from 'react'
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

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Gestión</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Miembros</h2>
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
      ) : members.length === 0 ? (
        <EmptyState title="Sin miembros" subtitle="Registra personas para comenzar." />
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <div key={member.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{member.full_name}</p>
                  <p className="text-xs text-muted">{member.role} · {member.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => handleEdit(member)}>Editar</Button>
                  <Button variant="soft" onClick={() => handleDelete(member.id)}>Eliminar</Button>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">{member.phone || 'Sin teléfono'} · {member.email || 'Sin email'}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
