import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold text-ink/80 transition hover:border-brand/60"
      type="button"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      {theme === 'dark' ? 'Luz' : 'Noche'}
    </button>
  )
}
