import { supabase } from '../lib/supabase'
import type { Case, Task, MaintenancePlan, Property, DbUser, Unit } from '../types'
import { handleApiError } from '../lib/errors'

// Properties API
export async function fetchProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('id, name, address, created_at')
      .order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    handleApiError(error, 'Hämtning av fastigheter')
    return []
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    handleApiError(error, 'Hämtning av fastighet')
    return null
  }
}

// Units API
export async function fetchUnits(): Promise<Unit[]> {
  try {
    const { data, error } = await supabase
      .from('units')
      .select('id, property_id, unit_number, created_at')
      .order('unit_number')
    
    if (error) throw error
    return data || []
  } catch (error) {
    handleApiError(error, 'Hämtning av enheter')
    return []
  }
}

export async function fetchUnitsByProperty(propertyId: string): Promise<Unit[]> {
  try {
    const { data, error } = await supabase
      .from('units')
      .select('id, property_id, unit_number, created_at')
      .eq('property_id', propertyId)
      .order('unit_number')
    
    if (error) throw error
    return data || []
  } catch (error) {
    handleApiError(error, 'Hämtning av enheter för fastighet')
    return []
  }
}

// Cases API
export async function fetchCases(): Promise<Case[]> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    handleApiError(error, 'Hämtning av ärenden')
    return []
  }
}

export async function fetchCaseById(id: string): Promise<Case | null> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*, properties(name, address), units(unit_number)')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as unknown as Case
  } catch (error) {
    handleApiError(error, 'Hämtning av ärende')
    return null
  }
}

export async function createCase(caseData: Omit<Case, 'id' | 'created_at' | 'updated_at'>): Promise<Case | null> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .insert(caseData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    handleApiError(error, 'Skapande av ärende')
    return null
  }
}

export async function updateCaseStatus(id: string, status: Case['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cases')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    handleApiError(error, 'Uppdatering av ärendestatus')
    return false
  }
}

export async function deleteCase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    handleApiError(error, 'Borttagning av ärende')
    return false
  }
}

// Tasks API
export async function fetchTasks(): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    handleApiError(error, 'Hämtning av arbetsorder')
    return []
  }
}

export async function fetchTasksByCase(caseId: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (error) {
    handleApiError(error, 'Hämtning av arbetsorder för ärende')
    return []
  }
}

// Maintenance API
export async function fetchMaintenancePlans(): Promise<MaintenancePlan[]> {
  try {
    const { data, error } = await supabase
      .from('maintenance_plans')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    handleApiError(error, 'Hämtning av underhållsplaner')
    return []
  }
}

export async function createMaintenancePlan(planData: Omit<MaintenancePlan, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenancePlan | null> {
  try {
    const { data, error } = await supabase
      .from('maintenance_plans')
      .insert(planData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    handleApiError(error, 'Skapande av underhållsplan')
    return null
  }
}

export async function deleteMaintenancePlan(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('maintenance_plans')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    handleApiError(error, 'Borttagning av underhållsplan')
    return false
  }
}

// Users API
export async function fetchUsers(): Promise<DbUser[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, role, email, created_at')
      .order('name')
    
    if (error) throw error
    return data || []
  } catch (error) {
    handleApiError(error, 'Hämtning av användare')
    return []
  }
}

// Search API
export async function searchGlobal(query: string) {
  try {
    const like = `%${query}%`
    
    const [cases, tasks, maintenance, properties] = await Promise.all([
      supabase.from('cases').select('id, title, description, status, created_at').or(`title.ilike.${like},description.ilike.${like}`).limit(5),
      supabase.from('tasks').select('id, description, status, due_date, case_id').or(`description.ilike.${like}`).limit(5),
      supabase.from('maintenance_plans').select('id, title, description, next_due_date').or(`title.ilike.${like},description.ilike.${like}`).limit(5),
      supabase.from('properties').select('id, name, address').or(`name.ilike.${like},address.ilike.${like}`).limit(5),
    ])
    
    return {
      cases: cases.data || [],
      tasks: tasks.data || [],
      maintenance: maintenance.data || [],
      properties: properties.data || [],
    }
  } catch (error) {
    handleApiError(error, 'Global sökning')
    return { cases: [], tasks: [], maintenance: [], properties: [] }
  }
}
