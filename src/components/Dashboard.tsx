import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCases, useMaintenance, useTasks } from '../hooks/useCases'
import { AlertCircle, Clock, CheckCircle2, PlusCircle, Kanban, Table, BarChart3, FileText, Wrench, Calendar } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import CountsOverview from './CountsOverview'
import RecentLists from './RecentLists'
import DashboardCharts from './DashboardCharts'
import { StatTile, StatTileSkeleton } from './common/StatTile'
import { Card, CardHeader, CardContent } from './common/Card'
import { isThisWeek } from '../lib/utils'
import KPIDetailModal from './KPIDetailModal'

export default function Dashboard() {
  const { items: cases, loading: loadingCases } = useCases()
  const { items: tasks, loading: loadingTasks } = useTasks()
  const { items: plans, loading: loadingPlans } = useMaintenance()
  const { profile, user } = useAuth()
  
  const [selectedKPI, setSelectedKPI] = useState<'openCases' | 'overdueTasks' | 'completedThisWeek' | null>(null)

  const isLoading = loadingCases || loadingTasks || loadingPlans

  const dashboardStats = {
    openCases: cases.filter((c) => c.status === 'reported' || c.status === 'in_progress').length,
    overdueTasks: tasks.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length,
    completedThisWeek: tasks.filter((t) => t.completed_at && isThisWeek(new Date(t.completed_at))).length,
    totalCases: cases.length,
    totalTasks: tasks.length,
    totalMaintenancePlans: plans.length
  }

  const getKPIData = (type: 'openCases' | 'overdueTasks' | 'completedThisWeek') => {
    switch (type) {
      case 'openCases':
        return cases.filter((c) => c.status === 'reported' || c.status === 'in_progress')
      case 'overdueTasks':
        return tasks.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed')
      case 'completedThisWeek':
        return tasks.filter((t) => t.completed_at && isThisWeek(new Date(t.completed_at)))
      default:
        return []
    }
  }

  const getKPITitle = (type: 'openCases' | 'overdueTasks' | 'completedThisWeek') => {
    switch (type) {
      case 'openCases': return 'Öppna Ärenden'
      case 'overdueTasks': return 'Försenade Uppgifter'
      case 'completedThisWeek': return 'Slutförda Denna Vecka'
      default: return ''
    }
  }

  const getKPIDescription = (type: 'openCases' | 'overdueTasks' | 'completedThisWeek') => {
    switch (type) {
      case 'openCases': return 'Visa alla öppna ärenden som behöver hanteras'
      case 'overdueTasks': return 'Visa alla försenade uppgifter som kräver omedelbar uppmärksamhet'
      case 'completedThisWeek': return 'Visa alla uppgifter som slutfördes denna vecka'
      default: return ''
    }
  }

  const quickActions = [
    {
      title: 'Nytt Ärende',
      description: 'Skapa en ny felanmälan',
      icon: <FileText size={20} />,
      href: '/cases/new',
      color: 'bg-[#FF6000] hover:bg-[#E55A00]',
      textColor: 'text-white'
    },
    {
      title: 'Ny Arbetsorder',
      description: 'Skapa en ny arbetsorder',
      icon: <Wrench size={20} />,
      href: '/tasks/new',
      color: 'bg-[#4F6CF5] hover:bg-[#3B5BDB]',
      textColor: 'text-white'
    },
    {
      title: 'Underhållsplan',
      description: 'Skapa en ny underhållsplan',
      icon: <Calendar size={20} />,
      href: '/maintenance/new',
      color: 'bg-[#16A34A] hover:bg-[#15803D]',
      textColor: 'text-white'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-[#161C3B] text-white">
          <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xl md:text-2xl font-semibold">Drift Dashboard</div>
                <div className="text-sm/relaxed text-[#F8F9FA]">Överblick över ärenden, arbetsorder och underhåll</div>
              </div>
            </div>
            <div className="flex items-center gap-4 md:ml-auto">
              <div className="text-sm text-[#F8F9FA]">
                {user?.email ? (
                  <span>
                    Inloggad som <span className="font-semibold">{profile?.name ?? user.email}</span>
                  </span>
                ) : (
                  <span>Utvecklingsläge</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#161C3B]">Snabbåtgärder</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className={`group p-4 rounded-xl border border-gray-200 hover:border-[#4F6CF5] transition-all duration-200 ${action.color} ${action.textColor}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    {action.icon}
                  </div>
                  <div>
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-sm opacity-90">{action.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigationsalternativ */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#161C3B]">Snabbnavigering</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              to="/kanban"
              className="group relative overflow-hidden rounded-xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ring-1 ring-transparent hover:ring-[#4F6CF5]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg text-white bg-[#4F6CF5] shadow-sm">
                  <Kanban size={22} />
                </div>
                <div>
                  <div className="font-semibold text-[#161C3B]">Kanban Board</div>
                  <div className="text-sm text-[#6C757D]">Hantera ärenden visuellt</div>
                </div>
              </div>
            </Link>

            <Link
              to="/cases"
              className="group relative overflow-hidden rounded-xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ring-1 ring-transparent hover:ring-[#FF6000]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg text-white bg-[#FF6000] shadow-sm">
                  <Table size={22} />
                </div>
                <div>
                  <div className="font-semibold text-[#161C3B]">Avancerad Lista</div>
                  <div className="text-sm text-[#6C757D]">Sök och filtrera ärenden</div>
                </div>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="group relative overflow-hidden rounded-xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all ring-1 ring-transparent hover:ring-[#4F6CF5]"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg text-white bg-[#4F6CF5] shadow-sm">
                  <BarChart3 size={22} />
                </div>
                <div>
                  <div className="font-semibold text-[#161C3B]">Analys & Rapporter</div>
                  <div className="text-sm text-[#6C757D]">Detaljerade insikter</div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatTileSkeleton />
          <StatTileSkeleton />
          <StatTileSkeleton />
          <StatTileSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div 
            className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
            onClick={() => setSelectedKPI('openCases')}
          >
            <StatTile 
              label="Öppna ärenden" 
              value={dashboardStats.openCases} 
              color="#4F6CF5" 
              icon={<AlertCircle size={18} />} 
              className="shadow-md hover:shadow-lg"
            />
          </div>
          
          <div 
            className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
            onClick={() => setSelectedKPI('overdueTasks')}
          >
            <StatTile 
              label="Försenade uppgifter" 
              value={dashboardStats.overdueTasks} 
              color="#FF6000" 
              icon={<Clock size={18} />} 
              className="shadow-md hover:shadow-lg"
            />
          </div>
          
          <div 
            className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
            onClick={() => setSelectedKPI('completedThisWeek')}
          >
            <StatTile 
              label="Klart denna vecka" 
              value={dashboardStats.completedThisWeek} 
              color="#161C3B" 
              icon={<CheckCircle2 size={18} />} 
              className="shadow-md hover:shadow-lg"
            />
          </div>
          
          <Card className="flex flex-col justify-between p-5">
            <div>
              <div className="text-xs uppercase tracking-wide text-[#6C757D]">Totalt</div>
              <div className="mt-1 text-sm text-[#6C757D]">Översikt av alla ärenden</div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6C757D]">Ärenden:</span>
                <span className="font-semibold text-[#161C3B]">{dashboardStats.totalCases}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6C757D]">Arbetsorder:</span>
                <span className="font-semibold text-[#161C3B]">{dashboardStats.totalTasks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6C757D]">Underhåll:</span>
                <span className="font-semibold text-[#161C3B]">{dashboardStats.totalMaintenancePlans}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* KPI Detail Modal */}
      {selectedKPI && (
        <KPIDetailModal
          isOpen={!!selectedKPI}
          onClose={() => setSelectedKPI(null)}
          type={selectedKPI}
          data={getKPIData(selectedKPI)}
          title={getKPITitle(selectedKPI)}
          description={getKPIDescription(selectedKPI)}
        />
      )}

      {/* Resten av dashboard-komponenterna */}
      <CountsOverview />
      <RecentLists />
      <DashboardCharts />
    </div>
  )
}


