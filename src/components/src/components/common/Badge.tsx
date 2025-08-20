import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  }
  
  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}

// Status-specific badges
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const getVariant = (status: string) => {
    switch (status) {
      case 'reported': return 'error'
      case 'in_progress': return 'info'
      case 'done': return 'success'
      case 'closed': return 'default'
      case 'pending': return 'warning'
      case 'completed': return 'success'
      default: return 'default'
    }
  }
  
  const getLabel = (status: string) => {
    switch (status) {
      case 'reported': return 'Rapporterad'
      case 'in_progress': return 'Pågår'
      case 'done': return 'Klar'
      case 'closed': return 'Stängd'
      case 'pending': return 'Väntar'
      case 'completed': return 'Klar'
      default: return status
    }
  }
  
  return (
    <Badge variant={getVariant(status)} className={className}>
      {getLabel(status)}
    </Badge>
  )
}

// Priority-specific badges
export function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const getVariant = (priority: string) => {
    switch (priority) {
      case 'låg': return 'default'
      case 'normal': return 'info'
      case 'hög': return 'warning'
      case 'akut': return 'error'
      default: return 'default'
    }
  }
  
  return (
    <Badge variant={getVariant(priority)} className={className}>
      {priority}
    </Badge>
  )
}
