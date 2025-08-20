import { useMemo } from 'react'
import { useCases } from '../hooks/useCases'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'

const COLORS = { primary: '#161C3B', orange: '#FF6000', blue: '#4F6CF5', gray: '#6C757D', green: '#16a34a' }

function groupByWeek(cases: any[]) {
  const fmt = (d: Date) => {
    const year = d.getUTCFullYear()
    const onejan = new Date(Date.UTC(year,0,1))
    const millis = d.getTime() - onejan.getTime()
    const week = Math.ceil((millis / 86400000 + onejan.getUTCDay() + 1) / 7)
    return `${year}-W${String(week).padStart(2,'0')}`
  }
  const map = new Map<string, number>()
  cases.forEach(c => {
    const d = new Date(c.created_at)
    const k = fmt(d)
    map.set(k, (map.get(k) ?? 0) + 1)
  })
  return Array.from(map.entries()).sort().map(([week, count]) => ({ week, count }))
}

function statusDist(cases: any[]) {
  const labels: Record<string,string> = { reported:'Rapporterad', in_progress:'Pågår', done:'Klar', closed:'Stängd' }
  const map = new Map<string, number>()
  cases.forEach(c => map.set(c.status, (map.get(c.status) ?? 0) + 1))
  return Object.keys(labels).map(k => ({ name: labels[k] ?? k, value: map.get(k) ?? 0, key: k }))
}

function avgHandlingDays(cases: any[]) {
  const done = cases.filter(c => c.status === 'done' || c.status === 'closed')
  if (done.length === 0) return 0
  const avg = done.reduce((sum, c) => {
    const start = new Date(c.created_at).getTime()
    const end = new Date(c.updated_at ?? c.created_at).getTime()
    return sum + Math.max(0, (end - start) / 86400000)
  }, 0) / done.length
  return Number(avg.toFixed(1))
}

export default function DashboardCharts() {
  const { items: cases } = useCases()

  const perWeek = useMemo(() => groupByWeek(cases), [cases])
  const dist = useMemo(() => statusDist(cases), [cases])
  const avgDays = useMemo(() => avgHandlingDays(cases), [cases])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm border-gray-200">
        <h2 className="font-semibold mb-3 text-[#161C3B]">Ärenden per vecka</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" hide={perWeek.length > 12} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.blue} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm border-gray-200">
        <h2 className="font-semibold mb-3 text-[#161C3B]">Statusfördelning</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dist} dataKey="value" nameKey="name" outerRadius={80} label>
                {dist.map((d) => (
                  <Cell key={d.key} fill={
                    d.key==='reported'?COLORS.gray : d.key==='in_progress'?COLORS.blue : d.key==='done'?COLORS.green : COLORS.primary
                  } />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm border-gray-200">
        <h2 className="font-semibold mb-3 text-[#161C3B]">Genomsnittlig handläggningstid</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[{ label: 'Genomsnitt (dagar)', value: avgDays }] }>
              <XAxis dataKey="label" hide />
              <YAxis domain={[0, Math.max(1, Math.ceil(avgDays+1))]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={COLORS.orange} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
