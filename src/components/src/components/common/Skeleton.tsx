interface SkeletonProps {
  className?: string
  lines?: number
  height?: string
}

export function Skeleton({ className = '', lines = 1, height = 'h-4' }: SkeletonProps) {
  if (lines === 1) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded ${height} ${className}`} />
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`animate-pulse bg-gray-200 rounded ${height}`}
          style={{ 
            width: i === lines - 1 ? '60%' : '100%' 
          }}
        />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
