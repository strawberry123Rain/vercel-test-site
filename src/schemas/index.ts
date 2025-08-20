import { z } from 'zod'

// Case form schema
export const caseFormSchema = z.object({
  title: z.string().min(1, 'Titel krävs'),
  description: z.string().optional(),
  property_id: z.string().min(1, 'Fastighet krävs'),
  unit_id: z.string().optional(),
  category: z.enum(['VVS', 'El', 'Lås', 'Värme', 'Ventilation', 'Övrigt']),
  priority: z.enum(['låg', 'normal', 'hög', 'akut']),
})

// Maintenance form schema
export const maintenanceFormSchema = z.object({
  title: z.string().min(1, 'Titel krävs'),
  description: z.string().optional(),
  property_id: z.string().min(1, 'Fastighet krävs'),
  frequency: z.enum(['monthly', 'quarterly', 'biannual', 'annual']),
  next_due_date: z.string().min(1, 'Nästa förfallodatum krävs'),
  estimated_duration_hours: z.number().min(0.5, 'Minst 0.5 timmar'),
  assigned_to: z.string().optional(),
  priority: z.enum(['låg', 'normal', 'hög']).default('normal'),
})

// Login form schema
export const loginFormSchema = z.object({
  email: z.string().email('Ogiltig e-postadress'),
  password: z.string().min(1, 'Lösenord krävs'),
})

// Export types
export type CaseFormValues = z.input<typeof caseFormSchema>
export type MaintenanceFormValues = z.input<typeof maintenanceFormSchema>
export type LoginFormValues = z.input<typeof loginFormSchema>
