import CaseList from '../components/CaseList'
import CaseForm from '../components/CaseForm'

export default function CasesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold mb-3">Ny felanmälan</h2>
        <CaseForm />
      </div>
      <CaseList />
    </div>
  )
}


