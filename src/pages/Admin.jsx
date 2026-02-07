import { useEffect, useState } from 'react'
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

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Administración</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Roles y permisos</h2>
        <p className="mt-2 text-sm text-muted">Asigna roles usando el UUID de usuario de Supabase Auth.</p>
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
      ) : userRoles.length === 0 ? (
        <EmptyState title="Sin roles asignados" subtitle="Asigna roles para activar permisos." />
      ) : (
        <div className="grid gap-4">
          {userRoles.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{item.roles?.name || 'Rol'}</p>
                  <p className="text-xs text-muted">{item.user_id}</p>
                </div>
                <Button variant="soft" onClick={() => handleDelete(item.id)}>Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
