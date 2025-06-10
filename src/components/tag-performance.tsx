import { cn } from '@/lib/utils'

// Types
import type { PERFORMANCE } from '@/types/performance-student'

interface TagPerformanceProps {
  performace: PERFORMANCE
}

export function TagPerformance({ performace }: TagPerformanceProps) {
  return (
    <span
      className={cn(
        'px-2 py-1 rounded-full text-xs font-medium',
        performace === 'Alto' && 'bg-green-100 text-green-800',
        performace === 'Médio' && 'bg-yellow-100 text-yellow-700',
        performace === 'Baixo' && 'bg-red-100 text-red-800',
      )}
    >
      {performace}
    </span>
  )
}
