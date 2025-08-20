import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from 'react-router-dom'
import { StatusBadge, PriorityBadge } from './common/Badge'
import { formatDateTime } from '../lib/utils'
import type { Case } from '../types'

interface KanbanItemProps {
  caseItem: Case
  isActive: boolean
}

export function KanbanItem({ caseItem, isActive }: KanbanItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: caseItem.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white border rounded-lg p-3 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200
        ${isActive ? 'ring-2 ring-blue-400 shadow-lg' : ''}
        ${isDragging ? 'rotate-2 scale-105' : ''}
      `}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/cases/${caseItem.id}`}
            className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
            onClick={(e) => e.stopPropagation()}
          >
            {caseItem.title}
          </Link>
          <PriorityBadge priority={caseItem.priority} />
        </div>
        
        {caseItem.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {caseItem.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{caseItem.category}</span>
          <span>{formatDateTime(caseItem.created_at)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <StatusBadge status={caseItem.status} />
          <div className="text-xs text-gray-400">
            #{caseItem.id.slice(0, 8)}
          </div>
        </div>
      </div>
    </div>
  )
}
