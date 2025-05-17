'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

// Icons
import { Loader2, Trash } from 'lucide-react'

// Http
import { getTeams } from '@/http/team/get-teams'

// Utils
import { formatPhone } from '@/utils/format-phone'

// Images
import UserProfileDefault from '@/assets/images/profile-default.webp'

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
import { Pagination } from '@/components/pagination'
import { ModalEditTeam } from './modal-edit-team'
import { AlertError } from '@/components/alert-error'

export function ListTeam() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? '1'

  const {
    data: dataTeam,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['get-teams', page],
    queryFn: async () =>
      getTeams({
        limit: 10,
        offset: (Number(page) - 1) * 10,
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 60, // 1hour
    placeholderData: (data) => data,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 1000, 5000),
  })

  console.log(dataTeam?.data)

  return (
    <div className="flex flex-col gap-10 h-screen p-4 ">
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
                <TableHead className="w-[400px] px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Nome
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="w-[300px] px-5 pb-5 text-left whitespace-nowrap overflow-visible">
                  <div className=" flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Função
                    </strong>
                  </div>
                </TableHead>

                <TableHead className="w-[250px] px-5 pb-5 text-left whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <strong className="text-sm font-bold text-black">
                      Celular
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
              {dataTeam?.data?.length !== 0
                ? dataTeam?.data?.map((team) => (
                    <TableRow
                      key={team.id}
                      className={`${isFetching ? 'opacity-40' : ''}`}
                    >
                      <TableCell className="w-[400px] px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {team.picture ? (
                            <Image
                              src={team.picture}
                              alt="Image de perfil"
                              width={50}
                              height={50}
                              className="min-w-12 min-h-12 max-w-12 max-h-12 object-cover rounded-sm"
                            />
                          ) : (
                            <Image
                              src={UserProfileDefault}
                              alt="Imagem padrão do membro"
                              width={50}
                              height={50}
                              className="min-w-12 min-h-12 max-w-12 max-h-12 object-cover rounded-sm"
                            />
                          )}
                          <span className="text-sm text-[#1c1d21] ">
                            {team.fullname ?? 'Não informado'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-[#1c1d21]">
                          {team?.role}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {formatPhone(team?.phone) ?? 'Não informado'}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs text-[#1c1d21] ">
                          {team.email ?? 'Sem investidor'}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-4">
                          <ModalEditTeam team={team} />
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
            pageIndex={Number(page)}
            totalCount={dataTeam?.count}
            perPage={10}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
