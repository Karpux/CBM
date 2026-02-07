import { Outlet } from 'react-router-dom'
import { DashboardNav } from '../dashboard/DashboardNav'

export const DashboardLayout = () => (
  <div className="min-h-screen bg-bg">
    <DashboardNav />
    <main className="container-px space-y-8 py-8">
      <Outlet />
    </main>
  </div>
)
