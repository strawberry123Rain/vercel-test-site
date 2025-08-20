import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCases } from '../hooks/useCases'
import { StatusBadge, PriorityBadge } from './common/Badge'
import { Card, CardHeader, CardContent } from './common/Card'
import { 
  DataTable, 
  DataTableHeader, 
  DataTableHeaderCell, 
  DataTableBody, 
  DataTableRow, 
  DataTableCell,
  DataTableEmpty,
  DataTableLoading
} from './common/DataTable'
import { formatDateTime } from '../lib/utils'
import type { CaseFilters } from '../types'

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true'

export default function CaseList() {
  const { items: cases, loading } = useCases()
  const [filters, setFilters] = useState<CaseFilters>({})

  const filteredCases = useMemo(() => {
    let filtered = cases
    
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status)
    }
    if (filters.priority) {
      filtered = filtered.filter(c => c.priority === filters.priority)
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(c => new Date(c.created_at) >= new Date(filters.dateFrom!))
    }
    if (filters.dateTo) {
      filtered = filtered.filter(c => new Date(c.created_at) <= new Date(filters.dateTo!))
    }
    
    return filtered
  }, [cases, filters])

  const handleFilterChange = (key: keyof CaseFilters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }))
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-[#161C3B]">
          Alla felanmälningar
        </h2>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <select
            className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Alla statusar</option>
            <option value="reported">Rapporterad</option>
            <option value="in_progress">Pågående</option>
            <option value="done">Klar</option>
            <option value="closed">Stängd</option>
          </select>
          
          <select
            className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">Alla prioriteter</option>
            <option value="låg">Låg</option>
            <option value="normal">Normal</option>
            <option value="hög">Hög</option>
            <option value="akut">Akut</option>
          </select>
          
          <input
            type="date"
            className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            placeholder="Från datum"
          />
          
          <input
            type="date"
            className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
            value={filters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            placeholder="Till datum"
          />
        </div>

        {/* Table */}
        <DataTable>
          <DataTableHeader>
            <tr>
              <DataTableHeaderCell className="rounded-tl-lg">Titel</DataTableHeaderCell>
              <DataTableHeaderCell>Fastighet</DataTableHeaderCell>
              <DataTableHeaderCell>Enhet</DataTableHeaderCell>
              <DataTableHeaderCell>Kategori</DataTableHeaderCell>
              <DataTableHeaderCell>Prioritet</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell className="rounded-tr-lg">Skapad</DataTableHeaderCell>
            </tr>
          </DataTableHeader>
          
          <DataTableBody>
            {loading ? (
              <DataTableLoading colSpan={7} />
            ) : filteredCases.length === 0 ? (
              <DataTableEmpty 
                message="Inga felanmälningar matchar filtret." 
                colSpan={7} 
              />
            ) : (
              filteredCases.map((caseItem) => (
                <DataTableRow key={caseItem.id}>
                  <DataTableCell>
                    <Link 
                      to={`/cases/${caseItem.id}`} 
                      className="font-medium text-[#161C3B] hover:underline"
                    >
                      {caseItem.title}
                    </Link>
                  </DataTableCell>
                  <DataTableCell>{caseItem.property_id}</DataTableCell>
                  <DataTableCell>{caseItem.unit_id ?? '-'}</DataTableCell>
                  <DataTableCell>{caseItem.category}</DataTableCell>
                  <DataTableCell>
                    <PriorityBadge priority={caseItem.priority} />
                  </DataTableCell>
                  <DataTableCell>
                    <StatusBadge status={caseItem.status} />
                  </DataTableCell>
                  <DataTableCell>
                    {formatDateTime(caseItem.created_at)}
                  </DataTableCell>
                </DataTableRow>
              ))
            )}
          </DataTableBody>
        </DataTable>
      </CardContent>
    </Card>
  )
}


