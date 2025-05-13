'use client'

import { useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

// Icons
import { Loader2, Trash } from 'lucide-react'

// Http
import { getAdmins } from '@/http/admins/get-admins'

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
import { ModalEditAdmin } from './modal-edit-admin'
import { AlertError } from '@/components/alert-error'

export function ListAdmins() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? 1

  const {
    data: dataAdmin,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['get-admins', page],
    queryFn: async () =>
      getAdmins({
        offset: (Number(page) - 1) * LIMIT_PER_PAGE,
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60, // 1hour
    placeholderData: (data) => data,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  })

  return (
    <div className="flex flex-col gap-8 h-screen p-4 ">
      <div className="flex flex-col gap-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button title="Adicionar" />
          </div>
        </div>

        <AlertError errorMessage={error?.message} />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-2">
        <div className="flex-1 overflow-auto">
          <Table className="min-w-full">
            <TableHeader className=" bg-[#f5f5fa]">
              <TableRow>
                <TableHead className="px-5 pb-5 text-left whitespace-nowrap overflow-visible">
                  <div className=" flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Nome
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Email
                    </strong>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataAdmin?.admins?.length !== 0
                ? dataAdmin?.admins?.map((admin) => (
                    <TableRow
                      key={admin.id}
                      className={`${isFetching ? 'opacity-40' : ''}`}
                    >
                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#1c1d21] ">
                          {admin.fullname}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#1c1d21] ">
                          {admin.email}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-4">
                          <ModalEditAdmin admin={admin} />
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
