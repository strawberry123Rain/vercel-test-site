import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCases } from '../hooks/useCases'
import AdvancedDataTable from '../components/AdvancedDataTable'
import { Card, CardHeader, CardContent } from '../components/common/Card'
import { Plus, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdvancedCasesPage() {
  const navigate = useNavigate()
  const { items: cases, loading, deleteCase } = useCases()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleViewCase = (id: string) => {
    navigate(`/cases/${id}`)
  }

  const handleEditCase = (id: string) => {
    navigate(`/cases/${id}/edit`)
  }

  const handleDeleteCase = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort detta ärende?')) return
    
    setIsDeleting(id)
    try {
      await deleteCase(id)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Tillbaka till Dashboard
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#161C3B]">
              Avancerad Ärendelista
            </h1>
            <p className="text-gray-600 mt-2">
              Sök, filtrera och hantera alla ärenden på ett effektivt sätt
            </p>
          </div>
          
          <Link
            to="/cases/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6000] text-white rounded-lg hover:bg-[#E55A00] transition-colors"
          >
            <Plus size={20} />
            Nytt Ärende
          </Link>
        </div>
      </div>

      <AdvancedDataTable
        cases={cases}
        loading={loading}
        onViewCase={handleViewCase}
        onEditCase={handleEditCase}
        onDeleteCase={handleDeleteCase}
      />
    </div>
  )
}
