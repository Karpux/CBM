import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { assignUserRole, deleteUserRole, fetchRoles, fetchUserRoles } from '../lib/api'

export const Admin = () => {
  const [roles, setRoles] = useState([])
  const [userRoles, setUserRoles] = useState([])
  const [userId, setUserId] = useState('')
  const [roleId, setRoleId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortKey, setSortKey] = useState('role')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  const load = async () => {
    try {
      const [rolesData, userRolesData] = await Promise.all([fetchRoles(), fetchUserRoles()])
      setRoles(rolesData)
      setUserRoles(userRolesData)
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

  const handleAssign = async (event) => {
    event.preventDefault()
    if (!userId || !roleId) return
    try {
      await assignUserRole({ user_id: userId, role_id: roleId })
      setUserId('')
      setRoleId('')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteUserRole(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredUserRoles = useMemo(() => {
    const term = search.trim().toLowerCase()
    return userRoles.filter((item) => {
      const matchesRole = roleFilter === 'all' || item.role_id === roleFilter
      const matchesTerm = !term || item.user_id.toLowerCase().includes(term)
      return matchesRole && matchesTerm
    })
  }, [userRoles, search, roleFilter])

  const sortedUserRoles = useMemo(() => {
    const sorted = [...filteredUserRoles]
    sorted.sort((a, b) => {
      const valueA = (sortKey === 'role' ? a.roles?.name : a.user_id) || ''
      const valueB = (sortKey === 'role' ? b.roles?.name : b.user_id) || ''
      if (valueA < valueB) return sortDir === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredUserRoles, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sortedUserRoles.length / pageSize))
  const paginatedRoles = sortedUserRoles.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [search, roleFilter, pageSize])

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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Administración</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Roles y permisos</h2>
        <p className="mt-2 text-sm text-muted">Asigna roles usando el UUID de usuario de Supabase Auth.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por UUID"
          className="flex-1 rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
        />
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
        >
          <option value="all">Todos los roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleAssign} className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft lg:grid-cols-[1.2fr_0.8fr_auto]">
        <label className="text-xs font-semibold uppercase text-muted">
          User ID
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
            placeholder="UUID del usuario"
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase text-muted">
          Rol
          <select
            value={roleId}
            onChange={(event) => setRoleId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink"
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button type="submit">Asignar</Button>
        </div>
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-sm text-muted">Cargando...</div>
      ) : filteredUserRoles.length === 0 ? (
        <EmptyState title="Sin roles asignados" subtitle="Asigna roles para activar permisos." />
      ) : (
        <div className="rounded-2xl border border-border bg-surface shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 text-xs text-muted">
            <div className="flex items-center gap-3">
              <span>{sortedUserRoles.length} resultados</span>
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
                    <button type="button" onClick={() => handleSort('role')}>Rol</button>
                  </th>
                  <th className="px-4 py-3">
                    <button type="button" onClick={() => handleSort('user')}>User ID</button>
                  </th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRoles.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Badge tone="brand">{item.roles?.name || 'Rol'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted">{item.user_id}</td>
                    <td className="px-4 py-3">
                      <Button variant="soft" onClick={() => handleDelete(item.id)}>Eliminar</Button>
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
