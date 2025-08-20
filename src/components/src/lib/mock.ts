import type { Property, Unit, Case, Task, MaintenancePlan } from '../types'

export const mockProperties: Property[] = [
	{ id: 'prop-1', name: 'Newsec Demo Fastighet', address: 'Exempelgatan 1, 111 11 Stockholm', created_at: new Date().toISOString() },
]

export const mockUnits: Unit[] = [
	{ id: 'unit-1', property_id: 'prop-1', unit_number: 'A12', type: 'lägenhet', size: 72, created_at: new Date().toISOString() },
]

export const mockCases: Case[] = [
	{ id: 'case-1', property_id: 'prop-1', unit_id: 'unit-1', title: 'Värmeproblem i trapphuset', description: 'Kallt på plan 3', category: 'Värme', priority: 'normal', status: 'reported', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), assigned_to: null, created_by: 'dev-user' },
	{ id: 'case-2', property_id: 'prop-1', unit_id: 'unit-1', title: 'Trasig belysning garage', description: 'Lampor slocknar intermittent', category: 'El', priority: 'hög', status: 'in_progress', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), assigned_to: 'dev-user', created_by: 'dev-user' },
	{ id: 'case-3', property_id: 'prop-1', unit_id: 'unit-1', title: 'Läckande kran i lokal', description: 'Droppar under disk', category: 'VVS', priority: 'låg', status: 'done', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), assigned_to: 'dev-user', created_by: 'dev-user' },
]

export const mockTasks: Task[] = [
	{ id: 'task-1', case_id: 'case-2', assigned_to: 'dev-user', description: 'Byt drivdon i armatur', status: 'in_progress', due_date: new Date(Date.now()+172800000).toISOString(), completed_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
	{ id: 'task-2', case_id: null, assigned_to: 'dev-user', description: 'Rondera allmänutrymmen', status: 'pending', due_date: new Date(Date.now()+86400000).toISOString(), completed_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export const mockMaintenancePlans: MaintenancePlan[] = [
	{ 
		id: 'maint-1', 
		property_id: 'prop-1', 
		title: 'OVK kontroll', 
		description: 'Årlig ventilationskontroll', 
		frequency: 'annual', 
		next_due_date: new Date(Date.now()+15552000000).toISOString(), 
		estimated_duration_hours: 4,
		assigned_to: 'dev-user', 
		priority: 'normal',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
]

export const mockUsers = [
	{ id: 'dev-user', name: 'Demo Användare', email: 'demo@newsec.se', role: 'förvaltare' as const, created_at: new Date().toISOString() },
]

export const mockProfile = mockUsers[0]
