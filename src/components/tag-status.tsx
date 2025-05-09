// Lib
import { cn } from '@/lib/utils'

// Types
import type { STATUS_STUDENT } from '@/types/status-student'

interface TagStatusProps {
  status: STATUS_STUDENT
}

export function TagStatus({ status }: TagStatusProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-sm',
        status === 'Cursando' && 'bg-green-100 text-green-800',
        status === 'Evadiu' && 'bg-red-200 text-red-700',
        status === 'Transferido' && 'bg-yellow-100 text-yellow-800',
        status === 'Formado' && 'bg-blue-100 text-blue-800',
        status === 'Reprovado' && 'bg-red-100 text-red-800',
      )}
    >
      {status}
    </span>
  )
}
