import { Navigate, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { useAuth } from './hooks/useAuth'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { Cells } from './pages/Cells'
import { Members } from './pages/Members'
import { Admin } from './pages/Admin'

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen bg-bg" />
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export const App = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/dashboard"
      element={
        <RequireAuth>
          <DashboardLayout />
        </RequireAuth>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="cells" element={<Cells />} />
      <Route path="members" element={<Members />} />
      <Route path="admin" element={<Admin />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
