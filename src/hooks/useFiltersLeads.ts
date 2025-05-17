import { useSearchParams } from 'next/navigation'

export function useFiltersLeads() {
  const searchParams = useSearchParams()

  const page = searchParams.get('page') ?? '1'
  const cityIn = searchParams.getAll('city_in')
  const search = searchParams.get('search')
  const stateIn = searchParams.getAll('state_in')
  const genderIn = searchParams.getAll('gender_in')
  const sexualityIn = searchParams.getAll('sexuality_in')
  const communityIn = searchParams.getAll('community_in')
  const skinColorIn = searchParams.getAll('skin_color_in')
  const incomeRangeIn = searchParams.getAll('income_range_in')
  const interestedCourseIn = searchParams.getAll('interested_course_in')

  return {
    page,
    cityIn,
    stateIn,
    search,
    genderIn,
    sexualityIn,
    communityIn,
    skinColorIn,
    incomeRangeIn,
    interestedCourseIn,
  }
}
