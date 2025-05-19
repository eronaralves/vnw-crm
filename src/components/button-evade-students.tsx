'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Icons
import { DoorOpen } from 'lucide-react'

// Http
import { evadeStudents } from '@/http/students/evade-students'

// Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface ButtonFailProps {
  studentEvaded: {
    studentId: string
    moduleId: string
    enrollmentId: string
  }
  onSuccess: () => void
}

export function ButtonEvadeStudents({
  studentEvaded,
  onSuccess,
}: ButtonFailProps) {
  const [openModal, setOpenModal] = useState(false)
  const [reasonGiveUp, setReasonGiveUp] = useState('')

  const queryClient = useQueryClient()
  const { mutate: failStudentMutate, isPending } = useMutation({
    mutationFn: evadeStudents,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['get-students'] })
      queryClient.invalidateQueries({ queryKey: ['get-leads'] })

      if (data?.message) {
        return toast.error(data.message, {
          duration: 3000,
          position: 'top-center',
        })
      }

      toast.success('Aluno(s) evadido(s) com sucesso', {
        duration: 3000,
        position: 'top-center',
      })

      setReasonGiveUp('')
      setOpenModal(false)

      onSuccess()
    },
  })

  async function handleFailStudent() {
    const { enrollmentId, moduleId, studentId } = studentEvaded

    if (reasonGiveUp.length === 0) {
      return toast.error('Selecione o motivo da evasão.', {
        duration: 2000,
        position: 'top-center',
      })
    }

    failStudentMutate({
      enrollmentId,
      moduleId,
      reason_give_up: reasonGiveUp,
      studentId,
    })
  }

  function onChangeModal() {
    setReasonGiveUp('')
    setOpenModal((prev) => !prev)
  }

  return (
    <Dialog open={openModal} onOpenChange={onChangeModal}>
      <DialogTrigger asChild>
        <Button title="Evadir" className="bg-red-500 hover:bg-red-400">
          <DoorOpen size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div>
          <DialogTitle>Deseja evadir aluno?</DialogTitle>

          <div className="w-full max-w-80 flex flex-col gap-1 mt-4">
            <label className="text-sm font-normal">Motivo da Evasão</label>
            <Select value={reasonGiveUp} onValueChange={setReasonGiveUp}>
              <SelectTrigger
                variant="secondary"
                className="flex-1 py-2 px-3 text-sm  rounded-none disabled:border-[#dddfe1] disabled:bg-[#e9ecef]"
              >
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>

              <SelectContent className="text-gray-900">
                <SelectItem value="Sem resposta">Sem resposta</SelectItem>
                <SelectItem value="Conflito de horários">
                  Conflito de horários
                </SelectItem>
                <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                <SelectItem value="Trabalho">Trabalho</SelectItem>
                <SelectItem value="Dificuldades técnicas">
                  Dificuldades técnicas
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogDescription className="mt-4 text-sm">
            Após confirmar não poderá reverter isso.
          </DialogDescription>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={onChangeModal}
              title="Cancelar"
              className="self-end bg-red-500 hover:bg-red-400"
              disabled={isPending}
            />

            <Button
              title="Confirmar"
              onClick={handleFailStudent}
              isPending={isPending}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
