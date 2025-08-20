import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/Dashboard'
import Login from './pages/Login'
import ProfilePage from './pages/Profile'
import CasesPage from './pages/Cases'
import TaskList from './components/TaskList'
import MaintenancePage from './pages/Maintenance'
import KanbanPage from './pages/KanbanPage'
import AdvancedCasesPage from './pages/AdvancedCasesPage'
import { useAuth } from './hooks/useAuth'
import CaseDetail from './pages/CaseDetail'

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true'
const DEV_BYPASS_AUTH = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true'

// Check if dev bypass is enabled via environment variable or session storage
function isDevBypassEnabled() {
  return USE_MOCK_DATA || DEV_BYPASS_AUTH || sessionStorage.getItem('devBypassAuth') === 'true'
}

function ProtectedRoute() {
  const { isLoading, session } = useAuth()
  if (isLoading) return <div className="p-6">Laddar...</div>
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}

function DevBypassRoute() {
  return <Outlet />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* If in dev mode with bypass, go directly to dashboard without auth */}
        {isDevBypassEnabled() ? (
          <Route path="/" element={<DevBypassRoute />}>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="cases" element={<CasesPage />} />
              <Route path="cases/:id" element={<CaseDetail />} />
              <Route path="tasks" element={<TaskList />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="kanban" element={<KanbanPage />} />
              <Route path="analytics" element={<AdvancedCasesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="cases" element={<CasesPage />} />
                <Route path="cases/:id" element={<CaseDetail />} />
                <Route path="tasks" element={<TaskList />} />
                <Route path="maintenance" element={<MaintenancePage />} />
                <Route path="kanban" element={<KanbanPage />} />
                <Route path="analytics" element={<AdvancedCasesPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}
