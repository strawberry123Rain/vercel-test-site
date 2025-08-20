import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Case, MaintenancePlan, Task } from '../types'
import { mockCases, mockTasks, mockMaintenancePlans } from '../lib/mock'
import { updateCaseStatus as updateCaseStatusApi, deleteCase as deleteCaseApi } from '../api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function useCases() {
  const [items, setItems] = useState<Case[]>(USE_MOCK ? mockCases : [])
  const [loading, setLoading] = useState(!USE_MOCK)

  useEffect(() => {
    if (USE_MOCK) return
    let isMounted = true
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('cases').select('*').order('created_at', { ascending: false })
      if (!error && isMounted) setItems((data ?? []) as unknown as Case[])
      setLoading(false)
    }
    fetchData()

    const channel = supabase
      .channel('public:cases')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, fetchData)
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const updateCaseStatus = async (caseId: string, newStatus: Case['status']) => {
    if (USE_MOCK) {
      setItems(prev => prev.map(c => 
        c.id === caseId ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c
      ))
      return true
    }

    try {
      const success = await updateCaseStatusApi(caseId, newStatus)
      if (success) {
        setItems(prev => prev.map(c => 
          c.id === caseId ? { ...c, status: newStatus, updated_at: new Date().toISOString() } : c
        ))
      }
      return success
    } catch (error) {
      console.error('Failed to update case status:', error)
      return false
    }
  }

  const deleteCase = async (caseId: string) => {
    if (USE_MOCK) {
      setItems(prev => prev.filter(c => c.id !== caseId))
      return true
    }

    try {
      const success = await deleteCaseApi(caseId)
      if (success) {
        setItems(prev => prev.filter(c => c.id !== caseId))
      }
      return success
    } catch (error) {
      console.error('Failed to delete case:', error)
      return false
    }
  }

  return { items, loading, updateCaseStatus, deleteCase }
}

export function useTasks() {
  const [items, setItems] = useState<Task[]>(USE_MOCK ? mockTasks : [])
  const [loading, setLoading] = useState(!USE_MOCK)

  useEffect(() => {
    if (USE_MOCK) return
    let isMounted = true
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
      if (!error && isMounted) setItems((data ?? []) as unknown as Task[])
      setLoading(false)
    }
    fetchData()
    const channel = supabase
      .channel('public:tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchData)
      .subscribe()
    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  return { items, loading }
}

export function useMaintenance() {
  const [items, setItems] = useState<MaintenancePlan[]>(USE_MOCK ? mockMaintenancePlans : [])
  const [loading, setLoading] = useState(!USE_MOCK)

  useEffect(() => {
    if (USE_MOCK) return
    let isMounted = true
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('maintenance_plans')
        .select('*')
        .order('next_due_date', { ascending: true })
      if (!error && isMounted) setItems((data ?? []) as unknown as MaintenancePlan[])
      setLoading(false)
    }
    fetchData()
    const channel = supabase
      .channel('public:maintenance_plans')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_plans' }, fetchData)
      .subscribe()
    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  return { items, loading }
}


