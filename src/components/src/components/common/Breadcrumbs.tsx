import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center text-[#6C757D] hover:text-[#161C3B] transition-colors"
      >
        <Home size={16} className="mr-1" />
        Dashboard
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={16} className="text-[#6C757D] mx-2" />
          {item.href ? (
            <Link 
              to={item.href}
              className="text-[#6C757D] hover:text-[#161C3B] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#161C3B] font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
