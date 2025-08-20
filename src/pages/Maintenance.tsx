import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import MaintenancePlanner from '../components/MaintenancePlanner'
import MaintenanceCalendar from '../components/MaintenanceCalendar'
import { Calendar, Settings } from 'lucide-react'

export default function MaintenancePage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'planner' | 'calendar'>('planner')

  // Handle URL parameter for tab
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'calendar') {
      setActiveTab('calendar')
    }
  }, [searchParams])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Underhåll</h1>
          <p className="text-gray-600 mt-1">Planera och hantera underhållsarbeten</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('planner')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'planner'
                ? 'border-[var(--color-blue)] text-[var(--color-blue)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings size={16} />
              Planering
            </div>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'calendar'
                ? 'border-[var(--color-blue)] text-[var(--color-blue)]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Kalender
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'planner' ? (
        <MaintenancePlanner />
      ) : (
        <MaintenanceCalendar />
      )}
    </div>
  )
}
