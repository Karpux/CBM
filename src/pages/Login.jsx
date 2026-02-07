import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { AuthLayout } from '../components/auth/AuthLayout'
import { useAuth } from '../hooks/useAuth'

export const Login = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await signIn({ email, password })
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      title="Bienvenido de regreso"
      subtitle="Ingresa para administrar reuniones, visitas y acciones pastorales."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
          Correo
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
          />
        </label>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
      <div className="mt-6 flex items-center justify-between text-xs text-muted">
        <span>¿No tienes cuenta?</span>
        <Link to="/register" className="font-semibold text-brand">
          Crear cuenta
        </Link>
      </div>
    </AuthLayout>
  )
}
