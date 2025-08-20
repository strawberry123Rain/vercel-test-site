// Core entity types
export type Role = 'admin' | 'förvaltare' | 'skötare'

export interface Property {
  id: string
  name: string
  address: string
  created_at: string
}

export interface Unit {
  id: string
  property_id: string
  unit_number: string
  type?: string
  size?: number
  created_at: string
}

export interface DbUser {
  id: string
  role: Role
  name: string
  email: string
  created_at: string
}

export interface Case {
  id: string
  property_id: string
  unit_id: string | null
  title: string
  description: string | null
  category: 'VVS' | 'El' | 'Lås' | 'Värme' | 'Ventilation' | 'Övrigt'
  priority: 'låg' | 'normal' | 'hög' | 'akut'
  status: 'reported' | 'in_progress' | 'done' | 'closed'
  created_at: string
  updated_at: string
  assigned_to: string | null
  created_by: string | null
}

export interface Task {
  id: string
  case_id: string | null
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string | null
  completed_at: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface MaintenancePlan {
  id: string
  property_id: string
  title: string
  description: string | null
  frequency: 'monthly' | 'quarterly' | 'biannual' | 'annual'
  next_due_date: string | null
  estimated_duration_hours: number
  assigned_to: string | null
  priority: 'låg' | 'normal' | 'hög'
  created_at: string
  updated_at: string
}

// Calendar and UI types
export interface CalendarEvent {
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

// Form types
export interface CaseFormData {
  title: string
  description?: string
  property_id: string
  unit_id?: string
  category: Case['category']
  priority: Case['priority']
}

export interface MaintenanceFormData {
  title: string
  description?: string
  property_id: string
  frequency: MaintenancePlan['frequency']
  next_due_date: string
  estimated_duration_hours: number
  assigned_to?: string
  priority: MaintenancePlan['priority']
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Filter types
export interface CaseFilters {
  status?: string
  category?: string
  priority?: string
  dateFrom?: string
  dateTo?: string
}

// Dashboard types
export interface DashboardStats {
  openCases: number
  overdueTasks: number
  completedThisWeek: number
  totalCases: number
  totalTasks: number
  totalMaintenancePlans: number
}

export interface ChartData {
  week: string
  count: number
}

export interface StatusDistribution {
  name: string
  value: number
  key: string
}
