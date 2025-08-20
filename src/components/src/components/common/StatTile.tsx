import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface StatTileProps {
  label: string
  value: number | string
  color: string
  icon: ReactNode
  className?: string
}

export function StatTile({ label, value, color, icon, className }: StatTileProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white backdrop-blur border shadow-sm p-5 transition-all hover:shadow-md hover:-translate-y-0.5',
        'border-gray-200',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-[#6C757D] font-medium">{label}</div>
        <div
          className="rounded-lg p-2 shadow-sm"
          style={{ background: `${color}14`, color }}
        >
          {icon}
        </div>
      </div>
      <div
        className="mt-3 text-3xl md:text-4xl font-bold"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  )
}

interface StatTileSkeletonProps {
  className?: string
}

export function StatTileSkeleton({ className }: StatTileSkeletonProps) {
  return (
    <div 
      className={cn(
        'rounded-2xl bg-white backdrop-blur border shadow-sm p-5 animate-pulse',
        'border-gray-200',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
      </div>
      <div className="h-10 w-20 bg-gray-200 rounded mt-3" />
    </div>
  )
}
