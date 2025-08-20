import { useState, useMemo } from 'react'
import { DndContext, closestCorners } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useCases } from '../hooks/useCases'
import { Card, CardHeader, CardContent } from './common/Card'
import type { Case } from '../types'
import { KanbanColumn } from './KanbanColumn'
import { KanbanItem } from './KanbanItem'

const STATUS_COLUMNS = [
  { id: 'reported', title: 'Rapporterade', color: '#6B7280' },
  { id: 'in_progress', title: 'Pågående', color: '#3B82F6' },
  { id: 'done', title: 'Klar', color: '#10B981' },
  { id: 'closed', title: 'Stängda', color: '#6B7280' }
] as const

export default function KanbanBoard() {
  const { items: cases, loading, updateCaseStatus } = useCases()
  const [activeId, setActiveId] = useState<string | null>(null)

  const casesByStatus = useMemo(() => {
    const grouped = STATUS_COLUMNS.reduce((acc, status) => {
      acc[status.id] = cases.filter(c => c.status === status.id)
      return acc
    }, {} as Record<string, Case[]>)
    
    return grouped
  }, [cases])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const caseId = active.id as string
    const newStatus = over.id as string

    // Type guard to ensure newStatus is a valid status
    if (newStatus && STATUS_COLUMNS.some(col => col.id === newStatus)) {
      const validStatus = newStatus as Case['status']
      await updateCaseStatus(caseId, validStatus)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {STATUS_COLUMNS.map(status => (
          <Card key={status.id}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary dark:text-white">
          Kanban Board - Ärenden
        </h2>
        <div className="text-sm text-gray-500">
          {cases.length} totalt ärende
        </div>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {STATUS_COLUMNS.map(status => (
            <KanbanColumn
              key={status.id}
              status={status}
              cases={casesByStatus[status.id] || []}
              activeId={activeId}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}
