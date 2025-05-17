'use client'

import Link from 'next/link'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

// Icons
import { Loader2, PlusCircle } from 'lucide-react'

// Http
import { getCourses } from '@/http/courses/get-courses'

// Components
import { Button } from '@/components/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LIMIT_PER_PAGE, Pagination } from '@/components/pagination'
import { ModalEditCourse } from './modal-edit-course'
import { AlertError } from '@/components/alert-error'
import { ButtonDelete } from './button-delete'

export function ListCourses() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? '1'

  const {
    data: dataCourses,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['get-courses', page],
    queryFn: async () =>
      getCourses({
        offset: (Number(page) - 1) * LIMIT_PER_PAGE,
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
    placeholderData: (data) => data,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  })

  return (
    <div className="flex-1 flex flex-col gap-8 min-h-screen p-4 ">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cursos/novo-curso">
            <Button title="Adicionar" />
          </Link>
        </div>
      </div>

      <AlertError errorMessage={error?.message} />

      <div className="overflow-hidden flex flex-col gap-2">
        <div className="overflow-auto">
          <Table className="min-w-full">
            <TableHeader className=" bg-[#f5f5fa]">
              <TableRow>
                <TableHead className="px-5 pb-5 text-left whitespace-nowrap overflow-visible">
                  <div className=" flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Nome do curso
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Linguagem
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Investidor
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Horário
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Turma
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Instrutor
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Facilitador
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Modalidade
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Polo
                    </strong>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataCourses?.courses?.length !== 0
                ? dataCourses?.courses?.map((course) => (
                    <TableRow
                      key={course.id}
                      className={`${isFetching ? 'opacity-40' : ''}`}
                    >
                      <TableCell className="p-5 whitespace-nowrap">
                        <span className="text-sm text-[#1c1d21]">
                          {course.name}
                        </span>
                      </TableCell>
                      <TableCell className="p-5 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {course.programing_language}
                        </span>
                      </TableCell>
                      <TableCell className="p-5 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {course.partner?.name ?? 'Sem investidor'}
                        </span>
                      </TableCell>
                      <TableCell className="p-5 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {course.start_time.slice(0, 5)} às{' '}
                          {course.finish_time.slice(0, 5)}
                        </span>
                      </TableCell>
                      <TableCell className="p-5 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {course.group}
                        </span>
                      </TableCell>
                      <TableCell className="p-5 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {course.instructor.fullname}
                        </span>
                      </TableCell>
                      <TableCell className="p-5 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {course.facilitator.fullname}
                        </span>
                      </TableCell>
                      <TableCell className="p-5 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {course.modality}
                        </span>
                      </TableCell>

                      <TableCell className="p-5 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {course.headquarter}
                        </span>
                      </TableCell>

                      <TableCell className="p-5 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            disabled
                            className="flex flex-col items-center gap-1 cursor-pointer text-gray-400 disabled:cursor-not-allowed"
                          >
                            <PlusCircle size={20} />
                            <span className="text-xs">Modulos</span>
                          </button>
                          <ModalEditCourse course={course} />
                          <ButtonDelete courseId={course.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : !isLoading && (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="px-5 py-10 text-gray-500 text-center"
                      >
                        Nenhum curso encontrado.
                      </TableCell>
                    </TableRow>
                  )}

              {isLoading && (
                <TableRow>
                  <TableCell colSpan={10} className="px-5 py-6 text-center">
                    <Loader2 className="animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex-1 mt-4 flex justify-center items-end">
          <Pagination
            pageIndex={Number(page)}
            totalCount={dataCourses?.count}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
