import { X, Calendar, Clock, Building, AlertCircle } from 'lucide-react'
import { StatusBadge, PriorityBadge } from './common/Badge'
import { formatDate, } from '../lib/utils'
import type { Case, Task, MaintenancePlan } from '../types'

interface KPIDetailModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'openCases' | 'overdueTasks' | 'completedThisWeek'
  data: Case[] | Task[] | MaintenancePlan[]
  title: string
  description: string
}

export default function KPIDetailModal({
  isOpen,
  onClose,
  type,
  data,
  title,
  description
}: KPIDetailModalProps) {
  if (!isOpen) return null

  const renderCaseItem = (caseItem: Case) => (
    <div key={caseItem.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-2">{caseItem.title}</h4>
          {caseItem.description && (
            <p className="text-sm text-gray-600 mb-3">{caseItem.description}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Building size={14} />
              <span>Fastighet: {caseItem.property_id}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle size={14} />
              <span>Kategori: {caseItem.category}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={14} />
              <span>Skapad: {formatDate(caseItem.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              <span>Uppdaterad: {formatDate(caseItem.updated_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <PriorityBadge priority={caseItem.priority} />
          <StatusBadge status={caseItem.status} />
        </div>
      </div>
    </div>
  )

  const renderTaskItem = (task: Task) => (
    <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-2">{task.description}</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={14} />
              <span>Förfaller: {task.due_date ? formatDate(task.due_date) : 'Ej satt'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              <span>Skapad: {formatDate(task.created_at)}</span>
            </div>
            {task.completed_at && (
              <div className="flex items-center gap-2 text-green-600">
                <Clock size={14} />
                <span>Slutförd: {formatDate(task.completed_at)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={task.status} />
          {task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed' && (
            <span className="text-red-600 text-sm font-medium">Försenad</span>
          )}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Inga {type === 'openCases' ? 'öppna ärenden' : type === 'overdueTasks' ? 'försenade uppgifter' : 'slutförda uppgifter'} att visa.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {type === 'openCases' && (data as Case[]).map(renderCaseItem)}
        {type === 'overdueTasks' && (data as Task[]).map(renderTaskItem)}
        {type === 'completedThisWeek' && (data as Task[]).map(renderTaskItem)}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
        
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  )
}
