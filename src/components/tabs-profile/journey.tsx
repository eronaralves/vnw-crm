'use client'

import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '../ui/table'
import { Bookmark, Github } from 'lucide-react'

interface JourneyProps {
  modules: {
    id: string
    name: string
    frequency: number
    desafio: {
      status: string
      github_username: string
      github_repository: string
    } | null
    feedback: {
      message: string
      performance: string
    } | null
  }[]
}

export function Journey({ modules }: JourneyProps) {
  function handleSendToGithub(urlGithub?: string) {
    if (urlGithub) {
      window.open(urlGithub, '_blank')
    }
  }

  return (
    <div className="h-full flex-1 px-6 py-8 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-5 pb-5 text-left whitespace-nowrap overflow-visible">
              <div className=" flex flex-col gap-2">
                <strong className="text-sm font-bold text-black">Módulo</strong>
              </div>
            </TableHead>

            <TableHead className="px-5 pb-5 text-left whitespace-nowrap overflow-visible">
              <div className=" flex flex-col gap-2">
                <strong className="text-sm font-bold text-black">
                  Frequência
                </strong>
              </div>
            </TableHead>

            <TableHead className="px-5 pb-5 text-left whitespace-nowrap overflow-visible">
              <div className=" flex flex-col gap-2">
                <strong className="text-sm font-bold text-black">
                  Desafios
                </strong>
              </div>
            </TableHead>

            <TableHead className="px-5 pb-5 text-left whitespace-nowrap overflow-visible">
              <div className=" flex flex-col gap-2">
                <strong className="text-sm font-bold text-black">
                  Desempenho
                </strong>
              </div>
            </TableHead>

            <TableHead className="px-5 pb-5 text-left whitespace-nowrap overflow-visible">
              <div className=" flex flex-col gap-2">
                <strong className="text-sm font-bold text-black">
                  Feedback
                </strong>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {modules.map((module) => (
            <TableRow key={module.id}>
              <TableCell className="px-5 py-4 whitespace-nowrap">
                <span className="text-sm text-[#1c1d21] ">{module.name}</span>
              </TableCell>

              <TableCell className="px-5 py-4 whitespace-nowrap">
                <div className="relative w-40 h-8 px-4 py-1.5 rounded-sm overflow-hidden bg-[#CFD4E5]">
                  <span
                    id="progress"
                    className={cn(
                      'absolute h-full inset-0 flex-1 z-20 bg-[#052997]',
                      module.frequency < 50 && 'bg-[#991313]',
                      module.frequency >= 50 && 'bg-[#dd580e]',
                      module.frequency >= 75 && 'bg-[#052997]',
                      module.frequency === null && 'bg-[#052997]',
                    )}
                    style={{
                      width: module.frequency ? `${module.frequency}%` : '100%',
                    }}
                  />
                  <span className="relative text-sm text-white z-90">
                    {module.frequency
                      ? `${Math.ceil(module.frequency)}%`
                      : 'Sem dados'}
                  </span>
                </div>
              </TableCell>

              <TableCell className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 cursor-pointer">
                  {module.desafio?.status ? (
                    <div
                      onClick={() =>
                        handleSendToGithub(
                          module.desafio?.github_username &&
                            `https://www.github.com/${module.desafio?.github_username}/${module.desafio?.github_repository}`,
                        )
                      }
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center p-2 text-white rounded-md',
                          module.desafio?.status === 'Completo' &&
                            'bg-[#36394D]',
                          module.desafio?.status === 'Entregue com atraso' &&
                            'bg-[#36394D]',
                          module.desafio?.status === 'Pendente' &&
                            'bg-[#cfd4e5]',
                        )}
                      >
                        <Github />
                      </div>

                      <span className="text-sm text-[#1c1d21] ">
                        {module.desafio?.status ?? 'Nenhum desafio enviado'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-[#1c1d21] ">
                      Nenhum desafio enviado
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {module.feedback?.performance && (
                    <div
                      className={cn(
                        'w-40 h-7 px-4 py-1.5 rounded-sm overflow-hidden bg-[#CFD4E5]',
                        module.feedback.performance === 'Baixo' &&
                          'bg-[#E69138]',
                        module.feedback.performance === 'Médio' &&
                          'bg-[#FFD966]',
                        module.feedback.performance === 'Alto' &&
                          'bg-[#93C47D]',
                      )}
                    />
                  )}
                  <span className="text-sm text-[#1c1d21] ">
                    {module.feedback?.performance ?? 'Nenhum desafio enviado'}
                  </span>
                </div>
              </TableCell>

              <TableCell className="px-5 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <Bookmark
                    size={28}
                    fill="#cfd4e5"
                    color={module.feedback?.message ? '#052997' : '#cfd4e5'}
                  />
                  <span className="text-sm text-[#1c1d21]">Ler</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
