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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/button'

interface ButtonFailProps {
  studentsEvaded: string[]
  onSuccess: () => void
}

export function ButtonEvadeStudents({
  studentsEvaded,
  onSuccess,
}: ButtonFailProps) {
  const [openModal, setOpenModal] = useState(false)

  const queryClient = useQueryClient()
  const { mutate: failStudentMutate } = useMutation({
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

      toast.success('Alunos evadidos com sucesso', {
        duration: 3000,
        position: 'top-center',
      })

      setOpenModal(false)
    },
  })

  async function handleFailStudent() {
    failStudentMutate(studentsEvaded)

    onSuccess()
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button title="Evadir" className="bg-red-500 hover:bg-red-400">
          <DoorOpen size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div>
          <DialogTitle>Confirmar evasão</DialogTitle>
          <DialogDescription className="mt-2">
            Após confirmar não poderá reverter isso.
          </DialogDescription>

          <div className="flex justify-end gap-2 mt-6">
            <DialogClose asChild>
              <Button
                title="Cancelar"
                className="self-end bg-red-500 hover:bg-red-400"
              />
            </DialogClose>

            <Button title="Confirmar" onClick={handleFailStudent} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
