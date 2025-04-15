'use client'

import { useSearchParams } from 'next/navigation'

import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

// Icons
import { Loader2, Trash } from 'lucide-react'

// Http
import { getPartners } from '@/http/partners/get-partners'

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
import { Pagination } from '@/components/pagination'

export function ListPartners() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? 1

  const {
    data: dataPartner,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['get-partners', page],
    queryFn: async () =>
      getPartners().then((res) => {
        if (res.message) {
          toast.error(res.message, { duration: 3000, position: 'top-center' })
        }

        return res
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60, // 1hour
    placeholderData: (data) => data,
  })

  console.log(dataPartner, 'FFF')

  return (
    <div className="flex flex-col gap-10 h-screen p-4 ">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button title="Adicionar" />
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-2">
        <div className="flex-1 overflow-auto">
          <Table className="min-w-full">
            <TableHeader className=" bg-[#f5f5fa]">
              <TableRow>
                <TableHead className="w-[300px] px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Empresa
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="w-[300px] px-5 pb-5 text-left whitespace-nowrap overflow-visible">
                  <div className=" flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Razão social
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="w-[250px] px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Ciclo
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Ano
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Valor investido
                    </strong>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataPartner?.data?.length !== 0
                ? dataPartner?.data?.map((partner) => (
                    <TableRow
                      key={partner.id}
                      className={`${isFetching ? 'opacity-40' : ''}`}
                    >
                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#1c1d21] ">
                          {partner.name}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {partner.company_name}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {partner.cycle}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {partner.year}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {new Intl.NumberFormat('pt-br', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(Number(partner.investment))}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            disabled
                            className="flex flex-col items-center gap-1 cursor-pointer text-gray-400 disabled:cursor-not-allowed"
                          >
                            <Trash size={20} />
                            <span className="text-xs">Deletar</span>
                          </button>
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
                        Nenhuma pessoa encontrada.
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

        <div className="mt-4 flex justify-center items-end">
          <Pagination
            pageIndex={1}
            totalCount={10}
            perPage={10}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  )
}
