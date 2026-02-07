import { Link } from 'react-router-dom'
import { ThemeToggle } from '../navigation/ThemeToggle'

export const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-bg">
    <div className="container-px flex min-h-screen flex-col">
      <div className="flex items-center justify-between py-6">
        <Link to="/" className="text-sm font-semibold text-ink">
          ← Volver a CBM
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">CBM Plataforma</p>
          <h1 className="mt-4 font-display text-3xl text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  </div>
)
