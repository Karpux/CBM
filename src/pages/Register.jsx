import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { AuthLayout } from '../components/auth/AuthLayout'
import { useAuth } from '../hooks/useAuth'

export const Register = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: signUpError } = await signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <AuthLayout
      title="Crea tu cuenta CBM"
      subtitle="Lidera células con visión y seguimiento integral."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted">
          Nombre completo
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-ink outline-none focus:border-brand"
          />
        </label>
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
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </Button>
      </form>
      <div className="mt-6 flex items-center justify-between text-xs text-muted">
        <span>¿Ya tienes cuenta?</span>
        <Link to="/login" className="font-semibold text-brand">
          Ingresar
        </Link>
      </div>
    </AuthLayout>
  )
}
