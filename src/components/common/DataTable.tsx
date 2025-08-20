import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface DataTableProps {
  children: ReactNode
  className?: string
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm text-gray-700">
        {children}
      </table>
    </div>
  )
}

interface DataTableHeaderProps {
  children: ReactNode
  className?: string
}

export function DataTableHeader({ children, className }: DataTableHeaderProps) {
  return (
    <thead className={cn('bg-gray-50 text-gray-600 uppercase text-xs', className)}>
      {children}
    </thead>
  )
}

interface DataTableHeaderCellProps {
  children: ReactNode
  className?: string
}

export function DataTableHeaderCell({ children, className }: DataTableHeaderCellProps) {
  return (
    <th className={cn('text-left p-3', className)}>
      {children}
    </th>
  )
}

interface DataTableBodyProps {
  children: ReactNode
  className?: string
}

export function DataTableBody({ children, className }: DataTableBodyProps) {
  return (
    <tbody className={cn(className)}>
      {children}
    </tbody>
  )
}

interface DataTableRowProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function DataTableRow({ children, className, onClick }: DataTableRowProps) {
  return (
    <tr 
      className={cn(
        'border-t border-gray-100 hover:bg-gray-50 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

interface DataTableCellProps {
  children: ReactNode
  className?: string
}

export function DataTableCell({ children, className }: DataTableCellProps) {
  return (
    <td className={cn('p-3', className)}>
      {children}
    </td>
  )
}

interface DataTableEmptyProps {
  message: string
  colSpan: number
}

export function DataTableEmpty({ message, colSpan }: DataTableEmptyProps) {
  return (
    <tr>
      <td className="p-6 text-center text-gray-500" colSpan={colSpan}>
        {message}
      </td>
    </tr>
  )
}

interface DataTableLoadingProps {
  colSpan: number
}

export function DataTableLoading({ colSpan }: DataTableLoadingProps) {
  return (
    <tr>
      <td className="p-6 text-center text-gray-500" colSpan={colSpan}>
        Laddar...
      </td>
    </tr>
  )
}
