import { useTasks } from '../hooks/useCases'

export default function TaskList() {
  const { items, loading } = useTasks()
  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-3">Beskrivning</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Förfallodatum</th>
            <th className="text-left p-3">Klar</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td className="p-3" colSpan={4}>Laddar...</td></tr>}
          {!loading && items.length === 0 && <tr><td className="p-3" colSpan={4}>Inga arbetsorder</td></tr>}
          {items.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-3">{t.description}</td>
              <td className="p-3">{t.status}</td>
              <td className="p-3">{t.due_date ? new Date(t.due_date).toLocaleDateString() : '-'}</td>
              <td className="p-3">{t.completed_at ? new Date(t.completed_at).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


