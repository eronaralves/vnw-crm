import { useSearchParams } from 'next/navigation'

export function useFiltersJourney() {
  const searchParams = useSearchParams()

  const page = searchParams.get('page') ?? '1'
  const search = searchParams.get('search') ?? ''
  const performance = searchParams.getAll('performance')

  return {
    page,
    search,
    performance,
  }
}
