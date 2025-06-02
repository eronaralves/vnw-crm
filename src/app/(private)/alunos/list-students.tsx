'use client'

import Link from 'next/link'
import { useState, Fragment } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { STATUS_STUDENT } from '@/types/status-student'

// Http
import { getStudents } from '@/http/students/get-students'
import { exportStudents } from '@/http/students/export-students'
import { getOptionsFilters } from '@/http/students/get-options-filters'

// Hooks
import { useDebounce } from '@/hooks/useDebouce'
import { useFiltersStudents } from '@/hooks/useFiltersStudents'

// Utils
import { formatPhone } from '@/utils/format-phone'
import { filtersTableStudents } from '@/utils/filters'
import { parseSearchParamsToObject } from '@/utils/parse-search-params-to-object'

// Icons
import { CheckCircle, FileDown, FileUp, Loader2 } from 'lucide-react'

// Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/button'
import { Checkbox } from '@/components/ui/checkbox'
import { LIMIT_PER_PAGE, Pagination } from '@/components/pagination'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ButtonFailStudents } from '@/components/button-fail-students'
import { ButtonEvadeStudents } from '@/components/button-evade-students'
import { AlertError } from '@/components/alert-error'
import { ButtonGraduatedStudents } from '@/components/button-graduated'
import { SelectMultiple } from '@/components/select-multiple'

type Spreadsheet = {
  link: string
  quantidade: number
}

type SelectedStudents = {
  id_student: string
  id_module: string
  enrollmentId: string
}
interface ListStudentProps {
  status: STATUS_STUDENT
}

export function ListStudent({ status }: ListStudentProps) {
  const [allChecked, setAllChecked] = useState(false)
  const [isExporting, setisExporting] = useState(false)
  const [exportedSpreadsheet, setExportedSpreadsheet] =
    useState<null | Spreadsheet>(null)
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudents[]>(
    [],
  )

  const [filters, setFilters] = useState(filtersTableStudents)
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')

  const debounceAgeMin = useDebounce(ageMin)
  const debounceAgeMax = useDebounce(ageMax)

  const router = useRouter()
  const searchParams = useSearchParams()

  const {
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
  } = useFiltersStudents()

  const filtersSelectedInobject = parseSearchParamsToObject(searchParams)

  const {
    data: dataStudents,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [
      'get-students',
      courseName,
      page,
      group,
      modality,
      search,
      study,
      work,
      city,
      state,
      status,
      gender,
      sexuality,
      community,
      reasonGiveUp,
      debounceAgeMin,
      debounceAgeMax,
      programingLanguage,
    ],
    queryFn: () =>
      getStudents({
        offset: (Number(page) - 1) * LIMIT_PER_PAGE,
        filters: {
          course_name: courseName,
          group,
          study: study.map((item: string) =>
            item === 'Sim' ? 'True' : 'False',
          ),
          work: work.map((item: string) => (item === 'Sim' ? 'True' : 'False')),
          city,
          state,
          status,
          gender,
          modality,
          sexuality,
          programing_language: programingLanguage,
          age_min: debounceAgeMin,
          age_max: debounceAgeMax,
          search,
          reason_give_up: reasonGiveUp,
          community,
        },
      }),

    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 30, // 30s
    staleTime: 1000 * 30, // 30s
    placeholderData: (data) => data,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  })

  useQuery({
    queryKey: ['get-options-filter-students'],
    queryFn: async () =>
      await getOptionsFilters().then((res) => {
        const optionsFilter = res.data

        const newFiltersOptions = filters.map((filter) => {
          if (!filter.id) {
            return filter
          }

          const options = optionsFilter[filter.id]
          const clearOptions = options.filter((option: string) => option)

          return {
            ...filter,
            options: clearOptions,
          }
        })

        setFilters(newFiltersOptions)

        return res
      }),
  })

  function handleStudentSelection({
    enrollmentId,
    id_module,
    id_student,
  }: SelectedStudents) {
    const hasStudentSelected = selectedStudents.find(
      (student) => student.id_student === id_student,
    )

    if (hasStudentSelected) {
      setSelectedStudents(
        selectedStudents.filter(
          (studentSelect) => studentSelect.id_student !== id_student,
        ),
      )
      setAllChecked(false)
    } else {
      setSelectedStudents([
        ...selectedStudents,
        { id_student, id_module, enrollmentId },
      ])
      if (selectedStudents.length + 1 === dataStudents?.students?.length) {
        setAllChecked(true)
      }
    }
  }

  async function handleExportStudent() {
    setisExporting(true)

    const response = await exportStudents({
      filters: {
        ...filtersSelectedInobject,
        status,
      },
    })

    if (response.message) {
      toast.error(response.message, {
        duration: 3000,
        position: 'top-center',
      })
    } else {
      setExportedSpreadsheet(response.data)
    }

    setisExporting(false)
  }

  function handleUploadSpreadsheet() {
    if (exportedSpreadsheet) {
      window.location.href = exportedSpreadsheet?.link

      setExportedSpreadsheet(null)
      router.replace('alunos')
    }
  }

  return (
    <div className="flex-1 h-full flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 h-8">
          {status === 'Cursando' && (
            <>
              <Button title="Importar">
                <FileDown size={17} color="#fff" />
              </Button>
              <Link href="/alunos/novo-aluno">
                <Button title="Adicionar" />
              </Link>
            </>
          )}

          {selectedStudents.length === 1 && status === 'Cursando' && (
            <ButtonEvadeStudents
              studentEvaded={{
                enrollmentId: selectedStudents[0].enrollmentId,
                moduleId: selectedStudents[0].id_module,
                studentId: selectedStudents[0].id_student,
              }}
              onSuccess={() => setSelectedStudents([])}
            />
          )}

          {selectedStudents.length > 0 && status === 'Cursando' && (
            <>
              <ButtonFailStudents
                studentsFaileds={selectedStudents}
                onSuccess={() => setSelectedStudents([])}
              />

              <ButtonGraduatedStudents
                graduatedStudents={selectedStudents}
                onSuccess={() => setSelectedStudents([])}
              />
            </>
          )}

          {selectedStudents.length > 0 && status === 'Formado' && (
            <Button
              title="Rematricula"
              className="bg-orange-400 hover:bg-orange-400/80"
            />
          )}
        </div>

        <AlertError errorMessage={error?.message} />
      </div>

      <div className="w-full flex-1 h-full flex flex-col relative">
        <Table>
          <TableHeader className=" bg-[#f5f5fa] ">
            <TableRow>
              <TableHead className="w-[50px] px-5 text-left whitespace-nowrap z-50">
                <Checkbox
                  className="w-5 h-5"
                  checked={allChecked}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStudents(
                        dataStudents?.students
                          ? dataStudents?.students?.map((student) => {
                              return {
                                id_student: student.id,
                                id_module: student.course.moduleCurrent,
                                enrollmentId: student.errolmentId,
                              }
                            })
                          : [],
                      )
                      setAllChecked(true)
                    } else {
                      setSelectedStudents([])
                      setAllChecked(false)
                    }
                  }}
                />
              </TableHead>

              <TableHead className="min-w-[400px] px-5 pb-5 pl-[60px] text-left whitespace-nowrap overflow-visible">
                <div className=" flex flex-col gap-2">
                  <strong className="text-sm font-bold text-black ">
                    Aluno
                  </strong>
                  <span className="text-[#80838e] font-normal m-0">ID</span>
                </div>
              </TableHead>

              <TableHead className="min-w-[300px] px-5 pb-5 text-left whitespace-nowrap">
                <div className="flex flex-col gap-2">
                  <strong className="text-sm font-bold text-black">
                    Contato
                  </strong>
                  <span className=" text-[#80838e] font-normal m-0 ">
                    E-mail e Celular
                  </span>
                </div>
              </TableHead>

              <TableHead className="min-w-[130px] px-5 pb-5 h-full flex text-left whitespace-nowrap">
                <div className="flex gap-8">
                  <div className="flex flex-col justify-between gap-2">
                    <strong className="text-sm font-bold text-black">
                      Idade Min
                    </strong>
                    <input
                      type="number"
                      onChange={(e) => setAgeMin(e.target.value)}
                      className="w-full border-b border-[#e0e0f2] py-2 outline-none"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-2">
                    <strong className="text-sm font-bold text-shadow-black">
                      Idade Máx
                    </strong>
                    <input
                      type="number"
                      onChange={(e) => setAgeMax(e.target.value)}
                      className="w-full border-b border-[#e0e0f2] py-2 outline-none"
                    />
                  </div>
                </div>
              </TableHead>

              {filters.map((filter) => {
                if (filter.value === 'reason_give_up' && status !== 'Evadiu') {
                  return null
                }

                return (
                  <TableHead
                    key={filter.name}
                    className="px-5 pb-5 text-left whitespace-nowrap  min-w-[250px]"
                  >
                    <div className="relative flex flex-col gap-2 z-50">
                      <label className="text-black font-bold">
                        {filter.name}
                      </label>

                      <SelectMultiple filter={filter} />
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {dataStudents?.students?.length !== 0
              ? dataStudents?.students?.map((student) => (
                  <TableRow
                    key={student?.errolmentId}
                    className={`${isFetching ? 'opacity-40' : ''}`}
                    onClick={(e) => {
                      const target = e.target as HTMLElement

                      if (target.closest('[data-ignore-row-click]')) return

                      router.push(`/alunos/${student.errolmentId}`)
                    }}
                  >
                    <TableCell className="p-5 whitespace-nowrap">
                      <Checkbox
                        data-ignore-row-click
                        className="w-5 h-5"
                        checked={Boolean(
                          selectedStudents.find(
                            (studentSelect) =>
                              studentSelect.id_student === student.id,
                          ),
                        )}
                        onCheckedChange={() =>
                          handleStudentSelection({
                            id_module: student.course.moduleCurrent,
                            id_student: student.id,
                            enrollmentId: student.errolmentId,
                          })
                        }
                      />
                    </TableCell>

                    <TableCell className="p-5 pl-[60px] whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <strong className="text-sm font-bold text-[#1c1d21]">
                          {student.fullname}
                        </strong>
                        <span className="text-xs text-[#1c1d21] ">
                          ID {student.id}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-[#1c1d21] ">
                          {student.email}
                        </span>
                        <span className="text-xs text-[#1c1d21] ">
                          {formatPhone(student?.phone)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.age}

                        {/* {differenceInYears(
                          new Date(),
                          new UTCDate(student.birth_date),
                        )} */}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.course.name}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.course.group}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.course.modality ?? 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.course.programing_language ?? 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.sexuality ?? 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.gender ?? 'Não informado'}
                      </span>
                    </TableCell>

                    {status === 'Evadiu' && (
                      <TableCell className="p-5 whitespace-nowrap">
                        <p className="w-[200px] truncate text-xs text-[#1c1d21] ">
                          {student.reason_give_up ?? 'Não informado'}
                        </p>
                      </TableCell>
                    )}

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.student_empregability?.study ? 'Sim' : 'Não'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.student_empregability?.work ? 'Sim' : 'Não'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.student_address?.community
                          ? student.student_address?.community
                          : 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student.student_address?.address?.city
                          ? student.student_address?.address?.city
                          : 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {student?.student_address?.address?.state
                          ? student?.student_address?.address?.state
                          : 'Não informado'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              : !isLoading && (
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

        <div className="flex justify-center mt-auto ">
          <Pagination
            className="mt-4"
            pageIndex={Number(page)}
            totalCount={dataStudents?.count}
            isLoading={isLoading}
          />
        </div>

        <hr className="w-full min-h-[8px] mt-5 bg-gradient-primary" />

        <div className="w-full max-w-[400px] flex items-center justify-between flex-wrap mt-7 px-4 py-2.5 gap-4 rounded-lg bg-[#5e81f419]">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[#8181a5] ">Total de alunos</span>
            <strong className="text-xl text-[#1c1d21]">
              {dataStudents?.count ?? '--'}
            </strong>
          </div>

          <Button
            title={isExporting ? 'Exportando' : 'Exportar'}
            variant="secondary"
            onClick={handleExportStudent}
            className="text-sm"
          >
            {isExporting ? (
              <Loader2 size={16} color="#00145d" className="animate-spin" />
            ) : (
              <FileUp size={16} color="#00145d" />
            )}
          </Button>
        </div>
      </div>

      <Dialog
        open={Boolean(exportedSpreadsheet)}
        onOpenChange={() => {
          setExportedSpreadsheet(null)
        }}
      >
        <DialogContent className="text-center">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="text-green-500 w-16 h-16" />

            <DialogHeader>
              <DialogTitle className=" text-center text-green-700">
                Planilha exportada com sucesso!
              </DialogTitle>
            </DialogHeader>

            <div className="w-full flex flex-col gap-8 mt-6">
              <div className="w-full flex flex-col gap-6 items-start">
                <h3 className="text-xl font-semibold">
                  Filtros selecionados:{' '}
                  <span>
                    {Object.keys(filtersSelectedInobject).filter(
                      (filter) => filter !== 'page',
                    ).length === 0 && 'Sem filtros'}
                  </span>
                </h3>

                <div className="w-full flex flex-col items-start gap-3">
                  {search && (
                    <span>
                      Pesquisa: <span className="font-semibold">{search}</span>
                    </span>
                  )}

                  {status && (
                    <span>
                      Status: <span className="font-semibold">{status}</span>
                    </span>
                  )}

                  {filters.map((filter) => {
                    if (filtersSelectedInobject[filter.value]) {
                      return (
                        <span key={filter.name}>
                          {filter.name} :{' '}
                          <span className="font-semibold">
                            {new Intl.ListFormat('pt-BR', {
                              style: 'long',
                              type: 'conjunction',
                            }).format(filtersSelectedInobject[filter.value])}
                          </span>
                        </span>
                      )
                    }

                    return null
                  })}
                </div>

                <span>
                  Alunos exportados: {exportedSpreadsheet?.quantidade}
                </span>
              </div>

              <Button
                className="self-center"
                title="Baixar planilha"
                onClick={handleUploadSpreadsheet}
                disabled={!exportedSpreadsheet?.link}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
