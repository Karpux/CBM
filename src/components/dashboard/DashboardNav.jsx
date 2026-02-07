import { Link, NavLink } from 'react-router-dom'
import { Button } from '../common/Button'
import { ThemeToggle } from '../navigation/ThemeToggle'
import { useAuth } from '../../hooks/useAuth'

export const DashboardNav = () => {
  const { signOut, user } = useAuth()

  return (
    <header className="border-b border-border bg-surface">
      <div className="container-px flex flex-wrap items-center justify-between gap-4 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">CBM Dashboard</p>
          <h1 className="mt-1 font-display text-2xl text-ink">Panel de liderazgo</h1>
          <p className="mt-1 text-xs text-muted">{user?.email || 'Equipo pastoral'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted">
            <NavLink to="/dashboard" className="rounded-full border border-transparent px-3 py-1 transition hover:text-ink">
              Resumen
            </NavLink>
            <NavLink to="/dashboard/cells" className="rounded-full border border-transparent px-3 py-1 transition hover:text-ink">
              Células
            </NavLink>
            <NavLink to="/dashboard/members" className="rounded-full border border-transparent px-3 py-1 transition hover:text-ink">
              Miembros
            </NavLink>
            <NavLink to="/dashboard/admin" className="rounded-full border border-transparent px-3 py-1 transition hover:text-ink">
              Admin
            </NavLink>
          </nav>
          <ThemeToggle />
          <Link to="/">
            <Button variant="outline">Ver landing</Button>
          </Link>
          <Button variant="soft" onClick={signOut}>Cerrar sesión</Button>
        </div>
      </div>
    </header>
  )
}
