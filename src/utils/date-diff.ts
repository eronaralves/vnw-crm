import {
  parseISO,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from 'date-fns'

type Unit = 'years' | 'months' | 'days'

export function dateDiff({
  from,
  to = new Date(),
  unit = 'years',
}: {
  from: string | Date
  to?: string | Date
  unit?: Unit
}): number {
  const start = typeof from === 'string' ? parseISO(from) : from
  const end = typeof to === 'string' ? parseISO(to) : to

  switch (unit) {
    case 'years':
      return differenceInYears(end, start)
    case 'months':
      return differenceInMonths(end, start)
    case 'days':
      return differenceInDays(end, start)
    default:
      throw new Error(`Unsupported unit: ${unit}`)
  }
}
