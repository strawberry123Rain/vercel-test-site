import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8'
}

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg'
}

export function Card({ 
  children, 
  className, 
  padding = 'md',
  shadow = 'sm',
  border = true 
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white',
        paddingClasses[padding],
        shadowClasses[shadow],
        border && 'border border-gray-200',
        className,
        'transition-all duration-300 hover:ring-2 hover:ring-offset-2 hover:ring-[#4F6CF5]' // Added hover ring
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  )
}
