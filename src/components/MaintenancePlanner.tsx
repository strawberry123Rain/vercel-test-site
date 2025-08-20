import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMaintenance } from '../hooks/useCases'
import { useQuery } from '@tanstack/react-query'
import { Plus, Calendar, Building, Clock, Edit, Trash2 } from 'lucide-react'
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
import { StatusBadge, PriorityBadge } from './common/Badge'
import { maintenanceFormSchema, type MaintenanceFormValues } from '../schemas'
import { fetchProperties, fetchUsers, createMaintenancePlan, deleteMaintenancePlan } from '../api'
import { handleApiError, showSuccess } from '../lib/errors'
import { formatDate, getFrequencyLabel } from '../lib/utils'
import { mockProperties } from '../lib/mock'

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true'

export default function MaintenancePlanner() {
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { items: maintenancePlans, loading } = useMaintenance()

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties,
    initialData: USE_MOCK_DATA ? mockProperties : undefined
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: !USE_MOCK_DATA
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      frequency: 'annual',
      priority: 'normal',
      estimated_duration_hours: 2,
    }
  })

  const onSubmit = async (values: MaintenanceFormValues) => {
    if (USE_MOCK_DATA) {
      console.log('MOCK: Creating maintenance plan', values)
      setIsCreating(false)
      reset()
      return
    }

    try {
      const result = await createMaintenancePlan({
        title: values.title,
        description: values.description || null,
        property_id: values.property_id,
        frequency: values.frequency,
        next_due_date: values.next_due_date,
        estimated_duration_hours: values.estimated_duration_hours,
        assigned_to: values.assigned_to || null,
        priority: values.priority || 'normal',
      })

      if (result) {
        showSuccess('Underhållsplan skapad')
        setIsCreating(false)
        reset()
      }
    } catch (error) {
      handleApiError(error, 'Skapande av underhållsplan')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna underhållsplan?')) return

    if (USE_MOCK_DATA) {
      console.log('MOCK: Deleting maintenance plan', id)
      return
    }

    try {
      const success = await deleteMaintenancePlan(id)
      if (success) {
        showSuccess('Underhållsplan borttagen')
      }
    } catch (error) {
      handleApiError(error, 'Borttagning av underhållsplan')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
                  <Building className="text-primary dark:text-white" size={24} />
        <h1 className="text-2xl font-bold text-primary dark:text-white">
            Underhållsplanering
          </h1>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
          style={{ background: '#FF6000' }}
        >
          <Plus size={18} />
          {isCreating ? 'Avbryt' : 'Ny plan'}
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-primary dark:text-white">
              Skapa ny underhållsplan
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Titel *"
                  error={errors.title?.message}
                >
                  <input
                    {...register('title')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="T.ex. Ventilationsservice"
                  />
                </FormField>

                <FormField
                  label="Fastighet *"
                  error={errors.property_id?.message}
                >
                  <select
                    {...register('property_id')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Välj fastighet</option>
                    {properties?.map(prop => (
                      <option key={prop.id} value={prop.id}>{prop.name}</option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Frekvens *"
                >
                  <select
                    {...register('frequency')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="monthly">Månadsvis</option>
                    <option value="quarterly">Kvartalsvis</option>
                    <option value="biannual">Halvårsvis</option>
                    <option value="annual">Årligen</option>
                  </select>
                </FormField>

                <FormField
                  label="Nästa förfallodatum *"
                  error={errors.next_due_date?.message}
                >
                  <input
                    {...register('next_due_date')}
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </FormField>

                <FormField
                  label="Uppskattad tid (timmar) *"
                  error={errors.estimated_duration_hours?.message}
                >
                  <input
                    {...register('estimated_duration_hours', { valueAsNumber: true })}
                    type="number"
                    step="0.5"
                    min="0.5"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </FormField>

                <FormField
                  label="Prioritet"
                >
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="låg">Låg</option>
                    <option value="normal">Normal</option>
                    <option value="hög">Hög</option>
                  </select>
                </FormField>

                <FormField
                  label="Tilldelad till"
                >
                  <select
                    {...register('assigned_to')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Ingen tilldelning</option>
                    {users?.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField
                label="Beskrivning"
              >
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Detaljerad beskrivning av underhållsarbetet..."
                />
              </FormField>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-white font-medium transition-colors"
                  style={{ background: '#4F6CF5' }}
                >
                  Skapa plan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false)
                    reset()
                  }}
                  className="px-6 py-2 rounded-lg border text-gray-700 font-medium transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  Avbryt
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-primary dark:text-white">
            Befintliga underhållsplaner
          </h2>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <DataTableLoading colSpan={7} />
          ) : maintenancePlans.length === 0 ? (
            <DataTableEmpty 
              message="Inga underhållsplaner ännu. Skapa din första plan ovan." 
              colSpan={7} 
            />
          ) : (
            <DataTable>
              <DataTableHeader>
                <tr>
                  <DataTableHeaderCell>Titel</DataTableHeaderCell>
                  <DataTableHeaderCell>Fastighet</DataTableHeaderCell>
                  <DataTableHeaderCell>Frekvens</DataTableHeaderCell>
                  <DataTableHeaderCell>Nästa datum</DataTableHeaderCell>
                  <DataTableHeaderCell>Prioritet</DataTableHeaderCell>
                  <DataTableHeaderCell>Tid</DataTableHeaderCell>
                  <DataTableHeaderCell>Åtgärder</DataTableHeaderCell>
                </tr>
              </DataTableHeader>
              
              <DataTableBody>
                {maintenancePlans.map((plan) => {
                  const property = properties?.find(p => p.id === plan.property_id)
                  
                  return (
                    <DataTableRow key={plan.id}>
                      <DataTableCell>
                        <div>
                          <div className="font-medium text-gray-900">{plan.title}</div>
                          {plan.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {plan.description}
                            </div>
                          )}
                        </div>
                      </DataTableCell>
                      <DataTableCell>
                        <div className="text-sm text-gray-900">
                          {property?.name || 'Okänd'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {property?.address}
                        </div>
                      </DataTableCell>
                      <DataTableCell>
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                          <Clock size={14} />
                          {getFrequencyLabel(plan.frequency)}
                        </span>
                      </DataTableCell>
                      <DataTableCell>
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                          <Calendar size={14} />
                          {plan.next_due_date ? formatDate(plan.next_due_date) : 'Ej satt'}
                        </span>
                      </DataTableCell>
                      <DataTableCell>
                        <PriorityBadge priority={plan.priority} />
                      </DataTableCell>
                      <DataTableCell className="text-sm text-gray-600">
                        {plan.estimated_duration_hours}h
                      </DataTableCell>
                      <DataTableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingId(plan.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Redigera"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Ta bort"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </DataTableCell>
                    </DataTableRow>
                  )
                })}
              </DataTableBody>
            </DataTable>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
