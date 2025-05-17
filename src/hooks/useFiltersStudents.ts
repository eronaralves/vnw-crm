import { useSearchParams } from 'next/navigation'

export function useFiltersStudents() {
  const searchParams = useSearchParams()

  const page = searchParams.get('page') ?? '1'
  const city = searchParams.getAll('city')
  const work = searchParams.getAll('work') ?? []
  const search = searchParams.get('search')
  const state = searchParams.getAll('state')
  const group = searchParams.getAll('group')
  const study = searchParams.getAll('study') ?? []
  const gender = searchParams.getAll('gender')
  const modality = searchParams.getAll('modality')
  const sexuality = searchParams.getAll('sexuality')
  const community = searchParams.getAll('community')
  const courseName = searchParams.getAll('course_name')
  const reasonGiveUp = searchParams.getAll('reason_give_up')
  const programingLanguage = searchParams.getAll('programing_language')

  return {
    page,
    city,
    work,
    search,
    state,
    group,
    study,
    gender,
    modality,
    sexuality,
    community,
    courseName,
    reasonGiveUp,
    programingLanguage,
  }
}
