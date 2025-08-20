import { useMaintenance } from '../hooks/useCases'

export default function MaintenanceList() {
  const { items, loading } = useMaintenance()
  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-3">Plan</th>
            <th className="text-left p-3">Frekvens</th>
            <th className="text-left p-3">Nästa datum</th>
          </tr>
        </thead>
        <tbody>
          {loading && <tr><td className="p-3" colSpan={3}>Laddar...</td></tr>}
          {!loading && items.length === 0 && <tr><td className="p-3" colSpan={3}>Inga underhållsplaner</td></tr>}
          {items.map((m) => (
            <tr key={m.id} className="border-t">
              <td className="p-3">{m.title}</td>
              <td className="p-3">{m.frequency}</td>
              <td className="p-3">{new Date(m.next_due_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


