import { Link, NavLink } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '../common/Button'

const navLinks = [
  { label: 'Visión', href: '#vision' },
  { label: 'Herramientas', href: '#herramientas' },
  { label: 'Impacto', href: '#impacto' },
  { label: 'Comunidad', href: '#comunidad' },
]

export const TopNav = () => (
  <header className="container-px relative z-10">
    <nav className="flex flex-wrap items-center justify-between gap-4 py-6">
      <Link
        to="/"
        className="flex items-center gap-3 rounded-full border border-border/70 bg-surface/80 px-4 py-2 text-sm font-semibold text-ink shadow-soft"
      >
        <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-bold text-brand">CBM</span>
        Celula de Barrio Modelo
      </Link>

      <div className="hidden items-center gap-6 text-sm font-semibold text-muted lg:flex">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="transition hover:text-ink">
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NavLink to="/login">
          <Button variant="outline">Ingresar</Button>
        </NavLink>
        <NavLink to="/register" className="hidden sm:block">
          <Button>Crear cuenta</Button>
        </NavLink>
      </div>
    </nav>
  </header>
)
