import { useState, useEffect, useRef } from 'react'
import { Search, Filter, X, Building, FileText, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCases, useTasks, useMaintenance } from '../hooks/useCases'
import { StatusBadge, PriorityBadge } from './common/Badge'

interface SearchResult {
  id: string
  type: 'case' | 'task' | 'maintenance'
  title: string
  description?: string
  status: string
  priority?: string
  href: string
}

export default function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    types: ['case', 'task', 'maintenance'],
    status: 'all',
    priority: 'all'
  })
  
  const searchRef = useRef<HTMLDivElement>(null)
  const { items: cases } = useCases()
  const { items: tasks } = useTasks()
  const { items: maintenance } = useMaintenance()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchResults: SearchResult[] = []
  
  if (query.length >= 2) {
    // Sök i ärenden
    if (filters.types.includes('case')) {
      cases.forEach(c => {
        if (c.title.toLowerCase().includes(query.toLowerCase()) ||
            c.description?.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            id: c.id,
            type: 'case',
            title: c.title,
            description: c.description || undefined,
            status: c.status,
            priority: c.priority,
            href: `/cases/${c.id}`
          })
        }
      })
    }

    // Sök i arbetsorder
    if (filters.types.includes('task')) {
      tasks.forEach(t => {
        if (t.description.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            id: t.id,
            type: 'task',
            title: t.description,
            status: t.status,
            href: `/tasks/${t.id}`
          })
        }
      })
    }

    // Sök i underhållsplaner
    if (filters.types.includes('maintenance')) {
      maintenance.forEach(m => {
        if (m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.description?.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            id: m.id,
            type: 'maintenance',
            title: m.title,
            description: m.description || undefined,
            status: 'active',
            href: `/maintenance/${m.id}`
          })
        }
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'case': return <FileText size={16} className="text-[#FF6000]" />
      case 'task': return <Wrench size={16} className="text-[#4F6CF5]" />
      case 'maintenance': return <Building size={16} className="text-[#16A34A]" />
      default: return <FileText size={16} />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'case': return 'Ärende'
      case 'task': return 'Arbetsorder'
      case 'maintenance': return 'Underhåll'
      default: return type
    }
  }

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      types: ['case', 'task', 'maintenance'],
      status: 'all',
      priority: 'all'
    })
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C757D]" size={20} />
        <input
          type="text"
          placeholder="Sök i ärenden, arbetsorder, underhåll..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-20 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6CF5] focus:border-transparent text-sm"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 rounded ${showFilters ? 'bg-[#4F6CF5] text-white' : 'text-[#6C757D] hover:text-[#161C3B]'}`}
            title="Filter"
          >
            <Filter size={16} />
          </button>
          
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#6C757D] hover:text-[#161C3B] rounded"
              title="Rensa sökning"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#161C3B] mb-2">Sök i</label>
              <div className="flex flex-wrap gap-2">
                {['case', 'task', 'maintenance'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('types', [...filters.types, type])
                        } else {
                          handleFilterChange('types', filters.types.filter(t => t !== type))
                        }
                      }}
                      className="rounded border-gray-300 text-[#4F6CF5] focus:ring-[#4F6CF5]"
                    />
                    <span className="text-sm text-[#6C757D]">{getTypeLabel(type)}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-[#6C757D] hover:text-[#161C3B] border border-gray-200 rounded hover:border-[#4F6CF5] transition-colors"
              >
                Rensa filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-[#6C757D]">
              <p className="text-sm">Inga resultat hittades för "{query}"</p>
            </div>
          ) : (
            <div className="p-2">
              <div className="text-xs font-medium text-[#6C757D] uppercase tracking-wide px-2 py-1">
                {searchResults.length} resultat
              </div>
              {searchResults.slice(0, 10).map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.href}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#161C3B] truncate">
                          {result.title}
                        </span>
                        <span className="text-xs text-[#6C757D] bg-gray-100 px-2 py-1 rounded">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      
                      {result.description && (
                        <p className="text-sm text-[#6C757D] line-clamp-2 mb-2">
                          {result.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <StatusBadge status={result.status} />
                        {result.priority && <PriorityBadge priority={result.priority} />}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {searchResults.length > 10 && (
                <div className="px-3 py-2 text-center">
                  <p className="text-sm text-[#6C757D]">
                    Visar 10 av {searchResults.length} resultat
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
