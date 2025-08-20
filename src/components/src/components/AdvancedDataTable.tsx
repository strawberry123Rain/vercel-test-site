import { useState, useMemo } from 'react'
import { Search, Filter, SortAsc, SortDesc, Eye, Edit, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardContent } from './common/Card'
import { StatusBadge, PriorityBadge } from './common/Badge'
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
import type { Case, CaseFilters } from '../types'

interface AdvancedDataTableProps {
  cases: Case[]
  loading: boolean
  onViewCase: (id: string) => void
  onEditCase: (id: string) => void
  onDeleteCase: (id: string) => void
}

type SortField = 'title' | 'created_at' | 'priority' | 'status' | 'category'
type SortDirection = 'asc' | 'desc'

export default function AdvancedDataTable({
  cases,
  loading,
  onViewCase,
  onEditCase,
  onDeleteCase
}: AdvancedDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<CaseFilters>({})
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedCases = useMemo(() => {
    let filtered = cases

    // Sökning
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term)
      )
    }

    // Filtrering
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status)
    }
    if (filters.priority) {
      filtered = filtered.filter(c => c.priority === filters.priority)
    }
    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category)
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(c => new Date(c.created_at) >= new Date(filters.dateFrom!))
    }
    if (filters.dateTo) {
      filtered = filtered.filter(c => new Date(c.created_at) <= new Date(filters.dateTo!))
    }

    // Sortering
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'created_at') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [cases, searchTerm, filters, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleFilterChange = (key: keyof CaseFilters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <SortAsc size={16} className="text-gray-400" />
    return sortDirection === 'asc' ? 
      <SortAsc size={16} className="text-blue-600" /> : 
      <SortDesc size={16} className="text-blue-600" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#161C3B]">
              Avancerad Ärendelista
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredAndSortedCases.length} av {cases.length} ärenden
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              Filter
            </button>
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Rensa
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Sökning */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Sök i ärenden..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
          />
        </div>

        {/* Avancerade filter */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
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
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">Alla prioriteter</option>
              <option value="låg">Låg</option>
              <option value="normal">Normal</option>
              <option value="hög">Hög</option>
              <option value="akut">Akut</option>
            </select>

            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Alla kategorier</option>
              <option value="VVS">VVS</option>
              <option value="El">El</option>
              <option value="Lås">Lås</option>
              <option value="Värme">Värme</option>
              <option value="Ventilation">Ventilation</option>
              <option value="Övrigt">Övrigt</option>
            </select>

            <input
              type="date"
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
              value={filters.dateFrom || ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              placeholder="Från datum"
            />

            <input
              type="date"
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
              value={filters.dateTo || ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              placeholder="Till datum"
            />
          </div>
        )}

        {/* Tabell */}
        <DataTable>
          <DataTableHeader>
            <tr>
              <DataTableHeaderCell 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  Titel
                  <SortIcon field="title" />
                </div>
              </DataTableHeaderCell>
              
              <DataTableHeaderCell 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-2">
                  Kategori
                  <SortIcon field="category" />
                </div>
              </DataTableHeaderCell>
              
              <DataTableHeaderCell 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center gap-2">
                  Prioritet
                  <SortIcon field="priority" />
                </div>
              </DataTableHeaderCell>
              
              <DataTableHeaderCell 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </DataTableHeaderCell>
              
              <DataTableHeaderCell 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-2">
                  Skapad
                  <SortIcon field="created_at" />
                </div>
              </DataTableHeaderCell>
              
              <DataTableHeaderCell>Åtgärder</DataTableHeaderCell>
            </tr>
          </DataTableHeader>

          <DataTableBody>
            {loading ? (
              <DataTableLoading colSpan={6} />
            ) : filteredAndSortedCases.length === 0 ? (
              <DataTableEmpty
                message={
                  searchTerm || Object.values(filters).some(Boolean)
                    ? "Inga ärenden matchar sökningen eller filtren."
                    : "Inga ärenden tillgängliga."
                }
                colSpan={6}
              />
            ) : (
              filteredAndSortedCases.map((caseItem) => (
                <DataTableRow key={caseItem.id} className="hover:bg-gray-50">
                  <DataTableCell>
                    <div>
                      <div className="font-medium text-gray-900">{caseItem.title}</div>
                      {caseItem.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {caseItem.description}
                        </div>
                      )}
                    </div>
                  </DataTableCell>
                  
                  <DataTableCell>
                    <span className="text-sm text-gray-600">{caseItem.category}</span>
                  </DataTableCell>
                  
                  <DataTableCell>
                    <PriorityBadge priority={caseItem.priority} />
                  </DataTableCell>
                  
                  <DataTableCell>
                    <StatusBadge status={caseItem.status} />
                  </DataTableCell>
                  
                  <DataTableCell>
                    <span className="text-sm text-gray-600">
                      {formatDateTime(caseItem.created_at)}
                    </span>
                  </DataTableCell>
                  
                  <DataTableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewCase(caseItem.id)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Visa detaljer"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditCase(caseItem.id)}
                        className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                        title="Redigera"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteCase(caseItem.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Ta bort"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
