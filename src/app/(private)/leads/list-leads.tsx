'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

// Http
import { getLeads } from '@/http/leads/get-leads'
import { exportLeads } from '@/http/leads/export-leads'
import { getOptionsFilters } from '@/http/leads/get-options-filters'

// Hooks
import { useDebounce } from '@/hooks/useDebouce'

// Hooks
import { useFiltersLeads } from '@/hooks/useFiltersLeads'

// Utils
import { cn } from '@/lib/utils'
import { formatPhone } from '@/utils/format-phone'
import { filtersTableLeads } from '@/utils/filters'
import { parseSearchParamsToObject } from '@/utils/parse-search-params-to-object'

// Icons
import {
  CheckCircle,
  Copy,
  CopyCheck,
  FileDown,
  FileUp,
  Loader2,
} from 'lucide-react'

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
import { LIMIT_PER_PAGE, Pagination } from '@/components/pagination'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormSearch } from '../../../components/form-search'
import { AlertError } from '@/components/alert-error'
import { SelectMultiple } from '@/components/select-multiple'

type Spreadsheet = {
  link: string
  quantidade: number
}

export function ListLeads() {
  const [copy, setCopy] = useState<string | null>(null)
  const [isExporting, setisExporting] = useState(false)
  const [exportedSpreadsheet, setExportedSpreadsheet] =
    useState<null | Spreadsheet>(null)

  const [filtersInTable, setFiltersInTable] = useState(filtersTableLeads)

  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')

  const debounceAgeMin = useDebounce(ageMin)
  const debounceAgeMax = useDebounce(ageMax)

  const router = useRouter()
  const searchParams = useSearchParams()

  // url state filters
  const {
    page,
    search,
    cityIn,
    stateIn,
    genderIn,
    sexualityIn,
    skinColorIn,
    communityIn,
    incomeRangeIn,
    interestedCourseIn,
  } = useFiltersLeads()

  const filtersInobject = parseSearchParamsToObject(searchParams)

  const {
    data: dataLeads,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [
      'get-leads',
      page,
      search,
      cityIn,
      stateIn,
      genderIn,
      sexualityIn,
      skinColorIn,
      communityIn,
      incomeRangeIn,
      debounceAgeMin,
      debounceAgeMax,
      interestedCourseIn,
    ],
    queryFn: async () =>
      await getLeads({
        offset: (Number(page) - 1) * LIMIT_PER_PAGE,
        filters: {
          city_in: cityIn,
          state_in: stateIn,
          gender_in: genderIn,
          sexuality_in: sexualityIn,
          age_min: debounceAgeMin,
          age_max: debounceAgeMax,
          community_in: communityIn,
          income_range_in: incomeRangeIn,
          interested_course_in: interestedCourseIn,
          skin_color_in: skinColorIn,
          search,
        },
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
    placeholderData: (data) => data,
    retry: 1,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  })

  const { data: filters, isLoading: loadingFilters } = useQuery({
    queryKey: ['get-options-filter-leads'],
    queryFn: getOptionsFilters,
    select: (res) => {
      const optionsFilter = res.data

      return filtersInTable.map((filter) => {
        if (!filter.id) return filter

        const options = optionsFilter[filter.id] || []
        const clearOptions = options
          .filter((option: string) => option)
          .map((item: string) => {
            return {
              label: item,
              value: item,
            }
          })

        return {
          ...filter,
          options: clearOptions,
        }
      })
    },
  })

  async function handleExportStudent() {
    setisExporting(true)

    const response = await exportLeads({
      filters: {
        ...filtersInobject,
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
      router.replace('leads')
    }
  }

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

  useEffect(() => {
    if (filters) {
      setFiltersInTable(filters)
    }
  }, [filters])

  return (
    <div className="w-full h-screen gap-6 flex flex-col overflow-auto">
      <div className="flex flex-col gap-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button title="Importar">
              <FileDown size={17} color="#fff" />
            </Button>
            <Link href="/leads/novo-lead">
              <Button title="Adicionar" />
            </Link>
          </div>

          <FormSearch />
        </div>

        <AlertError errorMessage={error?.message} />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-2">
        <Table>
          <TableHeader className="bg-[#f5f5fa] sticky top-0 z-40">
            <TableRow>
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

              {filtersInTable?.map((filter) => {
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

                      <SelectMultiple
                        filter={filter}
                        isLoading={loadingFilters}
                      />
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {dataLeads?.leads.map((lead) => (
              <TableRow
                tabIndex={0}
                key={lead.id}
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

                  router.push(`/leads/${lead.id}`)
                }}
              >
                <TableCell className="max-w-80 p-5 whitespace-nowrap">
                  <div className="flex gap-3">
                    <span className="text-sm truncate capitalize">
                      {lead.fullname}
                    </span>
                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(lead.fullname)
                      }}
                    >
                      {copy === lead.fullname ? (
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

                <TableCell className=" p-5 whitespace-nowrap">
                  <div
                    className="w-64 flex gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm text-[#1c1d21] truncate">
                      {lead.email}
                    </span>

                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(lead?.email)
                      }}
                    >
                      {copy === lead.email ? (
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
                      {lead.phone ? formatPhone(lead.phone) : 'Não informado'}
                    </span>

                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(lead?.phone)
                      }}
                    >
                      {lead?.phone &&
                        (copy === lead.phone ? (
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

                <TableCell className="text-center p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">{lead.age}</span>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">
                    {lead.interested_course ?? 'Não informado'}
                  </span>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">
                    {lead.sexuality ?? 'Não informado'}
                  </span>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">
                    {lead.gender ?? 'Não informado'}
                  </span>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">
                    {lead.skin_color ?? 'Não informado'}
                  </span>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">
                    {lead.student_socioeconomic_data?.income_range ??
                      'Não informado'}
                  </span>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">
                    {lead.student_address?.community
                      ? lead.student_address?.community
                      : 'Não informado'}
                  </span>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">
                    {lead.student_address?.address?.city
                      ? lead.student_address?.address?.city
                      : 'Não informado'}
                  </span>
                </TableCell>

                <TableCell className="p-5 whitespace-nowrap">
                  <span className="text-sm text-[#1c1d21] ">
                    {lead?.student_address?.address?.state
                      ? lead?.student_address?.address?.state
                      : 'Não informado'}
                  </span>
                </TableCell>
              </TableRow>
            ))}

            {dataLeads?.leads.length === 0 && !isLoading && (
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
            totalCount={dataLeads?.count}
            perPage={10}
            isLoading={isLoading}
          />
        </div>
        <div className="w-full max-w-[400px] flex items-center justify-between flex-wrap mt-2 px-4 py-2.5 gap-4 rounded-lg bg-[#5e81f419]">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[#8181a5] ">Total de alunos</span>
            <strong className="text-xl text-[#1c1d21]">
              {dataLeads?.count ?? '--'}
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
                    {Object.keys(filtersInobject).filter(
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

                  {filtersInTable.map((filter) => {
                    if (filtersInobject[filter.value]) {
                      return (
                        <span key={filter.name} className="text-start">
                          {filter.name} :{' '}
                          <span className="font-semibold">
                            {new Intl.ListFormat('pt-BR', {
                              style: 'long',
                              type: 'conjunction',
                            }).format(filtersInobject[filter.value])}
                          </span>
                        </span>
                      )
                    }

                    return null
                  })}
                </div>

                <span>Leads exportados: {exportedSpreadsheet?.quantidade}</span>
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
