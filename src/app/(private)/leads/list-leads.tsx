'use client'

import { useState, Fragment } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

// Http
import { getLeads } from '@/http/leads/get-leads'
import { exportLeads } from '@/http/leads/export-leads'
import { getOptionsFilters } from '@/http/leads/get-options-filters'

// Hooks
import { useDebounce } from '@/hooks/useDebouce'

// Utils
import { formatPhone } from '@/utils/format-phone'
import { filtersTableLeads } from '@/utils/filters'

// Icons
import {
  Check,
  CheckCircle,
  ChevronDown,
  FileDown,
  FileUp,
  Loader2,
  Trash,
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
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react'
import { Button } from '@/components/button'
import { LIMIT_PER_PAGE, Pagination } from '@/components/pagination'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormSearch } from '../../../components/form-search'

type Spreadsheet = {
  link: string
  quantidade: number
}

export function ListLeads() {
  const [isExporting, setisExporting] = useState(false)
  const [exportedSpreadsheet, setExportedSpreadsheet] =
    useState<null | Spreadsheet>(null)

  const [filters, setFilters] = useState(filtersTableLeads)
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')

  const debounceAgeMin = useDebounce(ageMin)
  const debounceAgeMax = useDebounce(ageMax)

  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  // url state filters
  const page = searchParams.get('page') ?? 1
  const cityIn = searchParams.getAll('city_in')
  const search = searchParams.get('search')
  const stateIn = searchParams.getAll('state_in')
  const genderIn = searchParams.getAll('gender_in')
  const sexualityIn = searchParams.getAll('sexuality_in')
  const communityIn = searchParams.getAll('community_in')
  const skinColorIn = searchParams.getAll('skin_color_in')
  const incomeRangeIn = searchParams.getAll('income_range_in')
  const interestedCourseIn = searchParams.getAll('interested_course_in')

  const filtersInobject: Record<string, string[]> = {}

  searchParams.forEach((value, key) => {
    if (filtersInobject[key]) {
      if (Array.isArray(filtersInobject[key])) {
        ;(filtersInobject[key] as string[]).push(value)
      } else {
        filtersInobject[key] = [filtersInobject[key] as string, value]
      }
    } else {
      filtersInobject[key] = [value]
    }
  })

  const {
    data: dataLeads,
    isLoading,
    isFetching,
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
      }).then((res) => {
        if (res.message) {
          toast.error(res.message, { duration: 3000, position: 'top-center' })
        }

        return res
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
    placeholderData: (data) => data,
  })

  useQuery({
    queryKey: ['get-options-filter-leads'],
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

  function handleMultiSelect(filterKey: string, selected: string[]) {
    params.delete('page')
    params.delete(filterKey)

    selected.forEach((value) => {
      params.append(filterKey, value)
    })

    router.push(`?${params.toString()}`)
  }

  function handleRemoveAllFilter(filterKey: string) {
    params.delete(filterKey)
    router.push(`?${params.toString()}`)
  }

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

  return (
    <div className="w-full h-full gap-10 flex flex-col">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button title="Importar">
            <FileDown size={17} color="#fff" />
          </Button>
          <Button title="Adicionar" />
        </div>

        <FormSearch />
      </div>

      <div className="w-full flex-1 h-full flex flex-col relative">
        <Table>
          <TableHeader className=" bg-[#f5f5fa] ">
            <TableRow>
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

              {filters.map((filter) => (
                <TableHead
                  key={filter.name}
                  className="px-5 pb-5 text-left whitespace-nowrap  min-w-[250px]"
                >
                  <div className="relative flex flex-col gap-2 z-50">
                    <label className="text-black font-bold">
                      {filter.name}
                    </label>
                    <Listbox
                      value={searchParams.getAll(filter.value)}
                      onChange={(value) =>
                        handleMultiSelect(filter.value, value)
                      }
                      multiple
                    >
                      <div className="relative w-[180px] z-[999px]">
                        <ListboxButton className="z-50 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
                          <span className="block truncate ">
                            {params?.getAll(filter.value)?.length
                              ? `${params?.getAll(filter.value)?.length} selecionado(s)`
                              : 'Todos'}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </span>
                        </ListboxButton>

                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100 overflow-auto hover:ring-black"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <ListboxOptions className="absolute mt-1 hover:ring-black overflow-auto max-h-[300px] min-w-[150px] z-[999px] rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer">
                            {filter?.options?.map((option, index) => (
                              <ListboxOption
                                key={index}
                                value={option}
                                className={({ active }) =>
                                  `relative z-[999px] cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? 'bg-blue-100 text-blue-900'
                                      : 'text-gray-900'
                                  }`
                                }
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {option}
                                    </span>
                                    {selected && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <Check className="w-4 h-4" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Transition>

                        {params?.getAll(filter.value)?.length > 0 && (
                          <button
                            onClick={() => handleRemoveAllFilter(filter.value)}
                            className="absolute -right-7 top-2 cursor-pointer"
                            title="Apagar filtros"
                          >
                            <Trash size={18} className="text-red-500" />
                          </button>
                        )}
                      </div>
                    </Listbox>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {dataLeads?.leads?.length !== 0
              ? dataLeads?.leads?.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className={`${isFetching ? 'opacity-40' : ''}`}
                  >
                    <TableCell className="p-5 pl-[60px] whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <strong className="text-sm font-bold text-[#1c1d21]">
                          {lead.fullname}
                        </strong>
                        <span className="text-xs text-[#1c1d21] ">
                          ID {lead.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="p-5 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-[#1c1d21] ">
                          {lead.email}
                        </span>
                        <span className="text-xs text-[#1c1d21] ">
                          {formatPhone(lead?.phone)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {lead.age}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {lead.sexuality ?? 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {lead.gender ?? 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {lead.skin_color ?? 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {lead?.interested_course ?? 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {lead.student_socioeconomic_data?.income_range ??
                          'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {lead.student_address?.community
                          ? lead.student_address?.community
                          : 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {lead.student_address?.address?.city ?? 'Não informado'}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 whitespace-nowrap">
                      <span className="text-xs text-[#1c1d21] ">
                        {lead.student_address?.address?.state ??
                          'Não informado'}
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
            totalCount={dataLeads?.count}
            isLoading={isLoading}
          />
        </div>

        <hr className="w-full min-h-[8px] mt-5 bg-gradient-primary" />

        <div className="w-full max-w-[400px] flex items-center justify-between flex-wrap mt-7 px-4 py-2.5 gap-4 rounded-lg bg-[#5e81f419]">
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
                  {search && <span>Pesquisa: {search}</span>}

                  {filters.map((filter) => {
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
