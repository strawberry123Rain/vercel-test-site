import { Link } from 'react-router-dom'
import { useCases, useMaintenance, useTasks } from '../hooks/useCases'
import { StatusBadge } from './common/Badge'

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all border-gray-200 ring-1 ring-transparent hover:ring-gray-200/60">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[#161C3B]">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function RecentLists() {
  const { items: cases, loading: loadingCases } = useCases()
  const { items: tasks, loading: loadingTasks } = useTasks()
  const { items: plans, loading: loadingPlans } = useMaintenance()

  const latestCases = cases.slice(0, 5)
  const latestTasks = tasks.slice(0, 5)
  const latestPlans = plans.slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card title="Senaste ärenden">
        {loadingCases ? (
          <Empty loading />
        ) : latestCases.length === 0 ? (
          <Empty text="Inga ärenden ännu" />
        ) : (
          <ul className="divide-y divide-gray-200">
            {latestCases.map((c) => (
              <li key={c.id} className="py-2">
                <Link to={`/cases/${c.id}`} className="flex items-center justify-between hover:underline">
                  <span className="text-sm text-gray-800">{c.title}</span>
                  <StatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Senaste arbetsorder">
        {loadingTasks ? (
          <Empty loading />
        ) : latestTasks.length === 0 ? (
          <Empty text="Inga arbetsorder ännu" />
        ) : (
          <ul className="divide-y divide-gray-200">
            {latestTasks.map((t) => (
              <li key={t.id} className="py-2">
                <Link to={`/tasks/${t.id}`} className="flex items-center justify-between hover:underline">
                  <span className="text-sm text-gray-800">{t.description}</span>
                  <span className="text-xs text-gray-500">{t.due_date ? new Date(t.due_date).toLocaleDateString() : '-'}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Senaste underhåll">
        {loadingPlans ? (
          <Empty loading />
        ) : latestPlans.length === 0 ? (
          <Empty text="Inga underhållsplaner ännu" />
        ) : (
          <ul className="divide-y divide-gray-200">
            {latestPlans.map((m) => (
              <li key={m.id} className="py-2">
                <Link to={`/maintenance/${m.id}`} className="flex items-center justify-between hover:underline">
                  <span className="text-sm text-gray-800">{m.title}</span>
                  <span className="text-xs text-gray-500">{m.next_due_date ? new Date(m.next_due_date).toLocaleDateString() : '-'}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

function Empty({ text = 'Laddar…', loading = false }: { text?: string; loading?: boolean }) {
  return (
    <div className="text-sm text-gray-500">
      {loading ? 'Laddar…' : text}
    </div>
  )
}
