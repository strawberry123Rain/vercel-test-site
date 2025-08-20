import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isThisWeek(date: Date): boolean {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = (day + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - diffToMonday)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return date >= monday && date <= sunday
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getFrequencyLabel(frequency: string): string {
  const labels: Record<string, string> = {
    monthly: 'Månadsvis',
    quarterly: 'Kvartalsvis',
    biannual: 'Halvårsvis',
    annual: 'Årligen'
  }
  return labels[frequency] || frequency
}

export function getFrequencyMonths(frequency: string): number {
  switch (frequency) {
    case 'monthly': return 1
    case 'quarterly': return 3
    case 'biannual': return 6
    case 'annual': return 12
    default: return 12
  }
}
