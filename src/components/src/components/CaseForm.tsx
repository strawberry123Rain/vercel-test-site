import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../lib/supabase'
import type { Property, Unit } from '../types'

const schema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  property_id: z.string().uuid(),
  unit_id: z.string().uuid().optional().nullable(),
  category: z.enum(['VVS', 'El', 'Lås', 'Värme', 'Ventilation', 'Övrigt']),
  priority: z.enum(['låg', 'normal', 'hög', 'akut']).default('normal'),
})

type FormValues = z.input<typeof schema>

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export default function CaseForm({ onCreated }: { onCreated?: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { priority: 'normal' } })

  const [properties, setProperties] = useState<Property[]>([])
  const [units, setUnits] = useState<Unit[]>([])

  useEffect(() => {
    const load = async () => {
      if (USE_MOCK) {
        setProperties([{ id: 'prop-1', name: 'Newsec Demo Fastighet', address: 'Exempelgatan 1', created_at: new Date().toISOString() }])
        return
      }
      const { data: props } = await supabase.from('properties').select('*').order('name')
      setProperties((props ?? []) as unknown as Property[])
    }
    load()
  }, [])

  const selectedProperty = watch('property_id')

  useEffect(() => {
    const loadUnits = async () => {
      if (!selectedProperty) {
        setUnits([])
        return
      }
      if (USE_MOCK) {
        setUnits([{ id: 'unit-1', property_id: 'prop-1', type: 'lägenhet', unit_number: 'A12', size: 72, created_at: new Date().toISOString() }])
        return
      }
      const { data: u } = await supabase.from('units').select('*').eq('property_id', selectedProperty).order('unit_number')
      setUnits((u ?? []) as unknown as Unit[])
    }
    loadUnits()
  }, [selectedProperty])

  const onSubmit = handleSubmit(async (values) => {
    if (USE_MOCK) {
      alert('Mock-läge: ärendet sparades inte i databasen, men formuläret fungerar.')
      reset()
      onCreated?.()
      return
    }
    const { error } = await supabase.from('cases').insert({
      title: values.title,
      description: values.description ?? null,
      property_id: values.property_id,
      unit_id: values.unit_id ?? null,
      category: values.category,
      priority: values.priority,
    })
    if (!error) {
      reset()
      onCreated?.()
    } else {
      // eslint-disable-next-line no-alert
      alert(error.message)
    }
  })

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Titel</span>
          <input className="border rounded px-3 py-2" placeholder="Kort titel" {...register('title')} />
          {errors.title && <span className="text-xs text-red-600">{errors.title.message}</span>}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Fastighet</span>
          <select className="border rounded px-3 py-2" {...register('property_id')}>
            <option value="">Välj fastighet</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.property_id && <span className="text-xs text-red-600">Välj fastighet</span>}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Enhet</span>
          <select className="border rounded px-3 py-2" {...register('unit_id')}>
            <option value="">Ingen</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.unit_number}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Kategori</span>
          <select className="border rounded px-3 py-2" {...register('category')}>
            {['VVS', 'El', 'Lås', 'Värme', 'Ventilation', 'Övrigt'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Prioritet</span>
          <select className="border rounded px-3 py-2" {...register('priority')}>
            {['låg', 'normal', 'hög', 'akut'].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Beskrivning</span>
        <textarea className="border rounded px-3 py-2" rows={4} placeholder="Beskriv problemet" {...register('description')} />
      </label>

      <div className="flex gap-2">
        <button disabled={isSubmitting} className="px-3 py-2 rounded bg-primary text-white text-sm hover:bg-primary/90 transition-colors">Spara</button>
      </div>
    </form>
  )
}


