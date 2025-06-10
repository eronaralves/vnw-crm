'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useQuery } from '@tanstack/react-query'
import { Copy, CopyCheck, Github, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

// Hooks
import { useFiltersJourney } from '@/hooks/useFiltersJourney'

// Utils
import { cn } from '@/lib/utils'
import { formatPhone } from '@/utils/format-phone'

// Http
import { getJourney } from '@/http/journey/get-journey'
import { getAllCourse } from '@/http/courses/get-all-courses'

// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { LIMIT_PER_PAGE, Pagination } from '@/components/pagination'
import { SelectMultiple } from '@/components/select-multiple'
import { TagPerformance } from '@/components/tag-performance'
import { FormSearch } from '@/components/form-search'
import { AlertError } from '@/components/alert-error'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ListJourney() {
  const [copy, setCopy] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  const course = searchParams.get('course')
  const module = searchParams.get('module') ?? undefined
  const { page, search, performance } = useFiltersJourney()

  function createQueryString(params: Record<string, string | null>) {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })

    return newSearchParams.toString()
  }

  const {
    data: journeyData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['get-journey', page, search, performance, module],
    queryFn: () =>
      getJourney({
        offset: (Number(page) - 1) * LIMIT_PER_PAGE,
        filters: {
          search,
          performance,
          module_name: module,
        },
      }),
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60, // 1min
    staleTime: 1000 * 60, // 1min
    placeholderData: (data) => data,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  })

  const { data: coursesData, isLoading: courseLoading } = useQuery({
    queryKey: ['get-all-courses'],
    queryFn: getAllCourse,
  })

  const modules = useMemo(() => {
    return coursesData?.courses?.find((c) => c.id === course)?.course_modules
  }, [coursesData, course])

  async function handleCopy(copy: string) {
    try {
      await navigator.clipboard.writeText(copy)
      setCopy(copy)

      setTimeout(() => {
        setCopy(null)
      }, 1000)
    } catch (err) {
      toast.warning(`Error ao copiar ${copy}, tente cle!`, {
        duration: 3000,
        position: 'top-center',
      })
    }
  }

  console.log(journeyData)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="w-full flex flex-col flex-wrap">
        <div className="w-full flex justify-between flex-wrap items-center gap-4 mb-3 ml-1">
          <div className="flex gap-3 mr-8">
            <div className="w-64 relative flex flex-col gap-2 z-50">
              <label className="text-black font-bold">Curso</label>

              <Select
                value={courseLoading ? '' : (course ?? 'all')}
                onValueChange={(value) => {
                  const newCourse = value === 'all' ? null : value
                  const queryString = createQueryString({
                    course: newCourse,
                    module: null,
                  })
                  router.push(`?${queryString}`)
                }}
              >
                <SelectTrigger isLoading={courseLoading}>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {coursesData?.courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-64 relative flex flex-col gap-2 z-50">
              <label className="text-black font-bold">Módulos</label>

              <Select
                disabled={course === null}
                value={module || ''}
                onValueChange={(value) => {
                  const queryString = createQueryString({
                    course,
                    module: value,
                  })
                  router.push(`?${queryString}`)
                }}
              >
                <SelectTrigger isLoading={courseLoading}>
                  <SelectValue placeholder="Selecione um módulo" />
                </SelectTrigger>

                <SelectContent>
                  {modules?.map((module) => (
                    <SelectItem key={module.id} value={module.name}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <FormSearch />
        </div>

        <AlertError errorMessage={error?.message} />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-2">
        <Table>
          <TableHeader className="bg-[#f5f5fa] sticky top-0 z-40">
            <TableRow>
              <TableHead className="px-5 pb-3 text-left whitespace-nowrap z-50">
                <Checkbox className="w-5 h-5" />
              </TableHead>

              <TableHead className="min-w-64 px-5 pb-3 text-left whitespace-nowrap overflow-visible">
                <strong className="text-sm font-semibold text-black ">
                  Aluno
                </strong>
              </TableHead>

              <TableHead className="min-w-52 px-5 pb-3 text-left whitespace-nowrap">
                <strong className="text-sm font-semibold text-black">
                  E-mail
                </strong>
              </TableHead>

              <TableHead className="min-w-36 px-5 pb-3 text-left whitespace-nowrap">
                <strong className="text-sm font-semibold text-black">
                  Celular
                </strong>
              </TableHead>

              <TableHead className="min-w-32 px-5 pb-3 text-left whitespace-nowrap">
                <strong className="text-sm font-semibold text-black">
                  Desafio
                </strong>
              </TableHead>

              <TableHead className="min-w-32 px-5 pb-3 text-left whitespace-nowrap">
                <div className="relative flex flex-col gap-2 z-50">
                  <label className="text-black font-bold">Desempenho</label>

                  <SelectMultiple
                    filter={{
                      value: 'performance',
                      options: [
                        {
                          label: 'Alto',
                          value: 'Alto',
                        },
                        {
                          label: 'Médio',
                          value: 'Médio',
                        },
                        {
                          label: 'Baixo',
                          value: 'Baixo',
                        },
                      ],
                    }}
                  />
                </div>
              </TableHead>

              <TableHead className="px-5 pb-3 text-left whitespace-nowrap">
                <strong className="text-sm font-semibold text-black">
                  Frquencia
                </strong>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {journeyData?.journey.map((journey) => (
              <TableRow
                tabIndex={0}
                key={journey.errolmentId}
                className={cn(
                  'hover:bg-gray-200/50',
                  isFetching && 'opacity-40',
                )}
                onClick={(e) => {
                  const targer = e.target as HTMLElement
                  const tagName = targer.tagName.toLowerCase()
                  if (tagName === 'button') {
                    return
                  }

                  router.push(`/alunos/${journey.errolmentId}`)
                }}
              >
                <TableCell className="px-5 whitespace-nowrap">
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5"
                  />
                </TableCell>

                <TableCell className="max-w-64 p-5 whitespace-nowrap">
                  <div className="flex gap-3">
                    <span className="text-sm truncate capitalize">
                      {journey.fullname}
                    </span>
                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(journey.fullname)
                      }}
                    >
                      {copy === journey.fullname ? (
                        <CopyCheck
                          size={16}
                          className="text-green-600 transition-all duration-200"
                        />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <div
                    className="flex gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm text-[#1c1d21] ">
                      {journey.email}
                    </span>

                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(journey?.email)
                      }}
                    >
                      {copy === journey.email ? (
                        <CopyCheck
                          size={16}
                          className="text-green-600 transition-all duration-200"
                        />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <div className="flex gap-3">
                    <span className="text-sm text-[#1c1d21] ">
                      {journey.phone
                        ? formatPhone(journey.phone)
                        : 'Não informado'}
                    </span>

                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(journey?.phone)
                      }}
                    >
                      {journey.phone &&
                        (copy === journey.phone ? (
                          <CopyCheck
                            size={16}
                            className="text-green-600 transition-all duration-200"
                          />
                        ) : (
                          <Copy size={16} />
                        ))}
                    </button>
                  </div>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">
                    <Github
                      size={20}
                      className={cn(
                        journey.challenge.github_repository
                          ? 'text-green-600'
                          : 'text-gray-400 cursor-not-allowed',
                      )}
                    />
                  </span>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  {journey.challenge?.feedback?.length > 0 ? (
                    <TagPerformance
                      performace={journey.challenge?.feedback[0]?.performance}
                    />
                  ) : (
                    <span className="relative text-sm">
                      Desempenho não informado
                    </span>
                  )}
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {journey.frequency ? (
                      <div className="relative w-20 h-2 rounded-sm overflow-hidden bg-[#CFD4E5]">
                        <span
                          id="progress"
                          className={`absolute h-full inset-0 flex-1 bg-[#052997]`}
                          style={{
                            width: `${journey.frequency}%`,
                          }}
                        />
                      </div>
                    ) : undefined}

                    <span className="relative text-sm">
                      {journey.frequency
                        ? `${Math.ceil(journey.frequency)}%`
                        : 'Sem dados'}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {journeyData?.journey.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={2} className="px-5 py-10 text-gray-500">
                  <div>Nenhum aluno encontrado.</div>
                </TableCell>
              </TableRow>
            )}

            {isLoading && (
              <TableRow>
                <TableCell colSpan={1} className="px-5 py-6">
                  <div>
                    <Loader2 className="animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-center items-end">
          <Pagination
            pageIndex={Number(page)}
            totalCount={journeyData?.count}
            perPage={10}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
