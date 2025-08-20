import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

async function fetchCount(table: string) {
  if (USE_MOCK) {
    if (table === 'cases') return 3
    if (table === 'tasks') return 2
    if (table === 'maintenance_plans') return 1
    if (table === 'properties') return 1
    return 0
  }
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

export default function CountsOverview() {
  const qProps = useQuery({ queryKey: ['count','properties'], queryFn: () => fetchCount('properties') })
  const qCases = useQuery({ queryKey: ['count','cases'], queryFn: () => fetchCount('cases') })
  const qTasks = useQuery({ queryKey: ['count','tasks'], queryFn: () => fetchCount('tasks') })
  const qMaint = useQuery({ queryKey: ['count','maintenance_plans'], queryFn: () => fetchCount('maintenance_plans') })

  const isLoading = qProps.isLoading || qCases.isLoading || qTasks.isLoading || qMaint.isLoading

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[#161C3B]">Databasöversikt</h2>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Skeleton /> <Skeleton /> <Skeleton /> <Skeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <Row label="Fastigheter" value={qProps.data ?? 0} />
          <Row label="Ärenden" value={qCases.data ?? 0} />
          <Row label="Arbetsorder" value={qTasks.data ?? 0} />
          <Row label="Underhållsplaner" value={qMaint.data ?? 0} />
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-3 flex items-center justify-between bg-white border-gray-200">
      <span className="text-[#6C757D]">{label}</span>
      <span className="text-lg font-semibold text-[#161C3B]">{value}</span>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="rounded-xl border p-3 bg-white border-gray-200 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="h-6 w-12 bg-gray-200 rounded mt-2" />
    </div>
  )
}
