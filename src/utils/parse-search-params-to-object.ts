export function parseSearchParamsToObject(searchParams: URLSearchParams) {
  return Array.from(searchParams.entries()).reduce(
    (acc, [key, value]) => {
      if (!acc[key]) acc[key] = []
      acc[key].push(value)
      return acc
    },
    {} as Record<string, string[]>,
  )
}
