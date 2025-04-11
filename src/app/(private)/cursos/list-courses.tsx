'use client'

import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

// Icons
import { Edit, PlusCircle, Trash } from 'lucide-react'

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

export function ListCourses() {
  const { data } = useQuery({
    queryKey: ['get-courses'],
    queryFn: async () =>
      getCourses({}).then((res) => {
        if (res.message) {
          toast.error(res.message, { duration: 3000, position: 'top-center' })
        }

        return res
      }),
  })

  console.log(data)

  return (
    <div className="w-full h-full gap-10 flex flex-col">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button title="Adicionar" />
        </div>
      </div>

      <div className="w-full flex-1 h-full flex flex-col relative">
        <Table>
          <TableHeader className=" bg-[#f5f5fa]">
            <TableRow>
              <TableHead className="px-5 pb-5 text-left whitespace-nowrap overflow-visible">
                <div className=" flex flex-col gap-2">
                  <strong className="text-sm font-bold text-black ">
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
                  <strong className="text-sm font-bold text-black">Polo</strong>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">
                  Full Stack - EPW
                </span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Python</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Empower</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">18:00 às 19:30</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Noite</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Vinicius Bispo</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Marina Gomes</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Online</span>
              </TableCell>

              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Alemão</span>
              </TableCell>

              <TableCell className="p-5 whitespace-nowrap">
                <div className="flex items-center justify-end gap-4">
                  <div className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]">
                    <PlusCircle size={20} />
                    <span className="text-xs">Modulos</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]">
                    <Edit size={20} />
                    <span className="text-xs">Editar</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]">
                    <Trash size={20} />
                    <span className="text-xs">Deletar</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">
                  Full Stack - EPW
                </span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Python</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Empower</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">18:00 às 19:30</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Noite</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Vinicius Bispo</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Marina Gomes</span>
              </TableCell>
              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Online</span>
              </TableCell>

              <TableCell className="p-5 whitespace-nowrap">
                <span className="text-xs text-[#1c1d21] ">Alemão</span>
              </TableCell>

              <TableCell className="p-5 whitespace-nowrap">
                <div className="flex items-center justify-end gap-4">
                  <div className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]">
                    <PlusCircle size={20} />
                    <span className="text-xs">Modulos</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]">
                    <Edit size={20} />
                    <span className="text-xs">Editar</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]">
                    <Trash size={20} />
                    <span className="text-xs">Deletar</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
