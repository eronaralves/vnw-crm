// Lib
import { cn } from '@/lib/utils'

// Http
import type { STATUS } from '@/http/students/get-student'

interface TagStatusProps {
  status: STATUS
}

export function TagStatus({ status }: TagStatusProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-sm',
        status === 'Cursando' && 'bg-green-100 text-green-800',
        status === 'Evadiu' && 'bg-red-100 text-red-800',
        status === 'Transferido' && 'bg-yellow-100 text-yellow-800',
        status === 'Formado' && 'bg-blue-100 text-blue-800',
        status === 'Reprovado' && 'bg-purple-100 text-purple-800',
      )}
    >
      {status}
    </span>
  )
}
