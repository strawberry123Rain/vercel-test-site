import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardHeader, CardContent } from './common/Card'
import { KanbanItem } from './KanbanItem'
import type { Case } from '../types'

interface KanbanColumnProps {
  status: {
    id: string
    title: string
    color: string
  }
  cases: Case[]
  activeId: string | null
}

export function KanbanColumn({ status, cases, activeId }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status.id,
  })

  return (
    <Card 
      className={`transition-colors ${
        isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{status.title}</h3>
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: status.color }}
          />
        </div>
        <div className="text-sm text-gray-500">
          {cases.length} ärende
        </div>
      </CardHeader>
      
      <CardContent>
        <div
          ref={setNodeRef}
          className={`min-h-[200px] space-y-3 ${
            isOver ? 'bg-blue-50 rounded-lg p-2' : ''
          }`}
        >
          <SortableContext
            items={cases.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {cases.map((caseItem) => (
              <KanbanItem
                key={caseItem.id}
                caseItem={caseItem}
                isActive={activeId === caseItem.id}
              />
            ))}
          </SortableContext>
          
          {cases.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Inga ärenden
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
