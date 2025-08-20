import { useMemo, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { sv } from 'date-fns/locale'
import { useMaintenance } from '../hooks/useCases'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { mockProperties } from '../lib/mock'
import { CalendarDays, Building, Clock } from 'lucide-react'

const locales = { sv }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  propertyName: string
  propertyAddress: string
  frequency: string
  description: string
  nextDueDate: string
}

export default function MaintenanceCalendar() {
  const { items: maintenancePlans } = useMaintenance()
  const [selectedProperty, setSelectedProperty] = useState<string>('all')

  // Fetch properties for filtering
  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      if (USE_MOCK) return mockProperties
      const { data } = await supabase.from('properties').select('id, name, address')
      return data || []
    }
  })

  // Convert maintenance plans to calendar events
  const events = useMemo(() => {
    const events: CalendarEvent[] = []
    
    maintenancePlans.forEach(plan => {
      if (selectedProperty !== 'all' && plan.property_id !== selectedProperty) return
      
      const property = properties?.find(p => p.id === plan.property_id)
      if (!property) return
      
      // Create events for the next 6 months
      const startDate = new Date(plan.next_due_date || plan.created_at)
      for (let i = 0; i < 6; i++) {
        const eventDate = new Date(startDate)
        eventDate.setMonth(eventDate.getMonth() + (i * getFrequencyMonths(plan.frequency)))
        
        events.push({
          id: `${plan.id}-${i}`,
          title: plan.title,
          start: eventDate,
          end: new Date(eventDate.getTime() + 24 * 60 * 60 * 1000), // 1 day duration
          propertyName: property.name,
          propertyAddress: property.address,
          frequency: plan.frequency,
          description: plan.description || '',
          nextDueDate: plan.next_due_date || plan.created_at,
        })
      }
    })
    
    return events.sort((a, b) => a.start.getTime() - b.start.getTime())
  }, [maintenancePlans, properties, selectedProperty])

  const eventStyleGetter = (event: CalendarEvent) => {
    const isOverdue = new Date(event.start) < new Date()
    return {
      style: {
        backgroundColor: isOverdue ? '#ef4444' : '#4F6CF5',
        borderRadius: '6px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    }
  }

  const eventPropGetter = (event: CalendarEvent) => {
    return {
      title: `${event.title} - ${event.propertyName}`,
      'aria-label': `${event.title} på ${event.propertyName}, ${event.description}`
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
                  <CalendarDays className="text-[#161C3B]" size={20} />
        <h2 className="text-xl font-semibold text-[#161C3B]">Underhållskalender</h2>
        </div>
        
        <div className="sm:ml-auto flex items-center gap-3">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200"
          >
            <option value="all">Alla fastigheter</option>
            {properties?.map(prop => (
              <option key={prop.id} value={prop.id}>{prop.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar */}
              <div className="rounded-2xl border bg-white p-5 shadow-sm border-gray-200">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventPropGetter}
          eventStyleGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          messages={{
            next: "Nästa",
            previous: "Föregående",
            today: "Idag",
            month: "Månad",
            week: "Vecka",
            day: "Dag",
            noEventsInRange: "Inga planerade aktiviteter i detta intervall.",
          }}
          tooltipAccessor={(event) => (
            <div className="p-2">
              <div className="font-semibold">{event.title}</div>
              <div className="text-sm text-gray-600">{event.propertyName}</div>
              <div className="text-sm text-gray-600">{event.propertyAddress}</div>
              <div className="text-sm text-gray-600">Frekvens: {event.frequency}</div>
              {event.description && (
                <div className="text-sm text-gray-600 mt-1">{event.description}</div>
              )}
            </div>
          )}
        />
      </div>

      {/* Legend */}
              <div className="rounded-2xl border bg-white p-4 shadow-sm border-gray-200">
        <h3 className="font-medium text-[#161C3B] mb-3">Förklaring</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4F6CF5' }}></div>
            <span>Planerad aktivitet</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Försenad aktivitet</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function getFrequencyMonths(frequency: string): number {
  switch (frequency) {
    case 'monthly': return 1
    case 'quarterly': return 3
    case 'biannual': return 6
    case 'annual': return 12
    default: return 12
  }
}
