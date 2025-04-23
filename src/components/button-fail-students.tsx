'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Icons
import { XCircle } from 'lucide-react'

// Http
import { failStudents } from '@/http/students/fail-students'

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
  studentsFaileds: {
    id_student: string
    id_module: string
  }[]
  onSuccess: () => void
}

export function ButtonFailStudents({
  studentsFaileds,
  onSuccess,
}: ButtonFailProps) {
  const [openModal, setOpenModal] = useState(false)

  const queryClient = useQueryClient()
  const { mutate: failStudentMutate } = useMutation({
    mutationFn: failStudents,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['get-students'] })
      queryClient.invalidateQueries({ queryKey: ['get-leads'] })

      if (data?.message) {
        return toast.error(data.message, {
          duration: 3000,
          position: 'top-center',
        })
      }

      toast.success('Alunos reprovados com sucesso', {
        duration: 3000,
        position: 'top-center',
      })

      setOpenModal(false)
    },
  })

  async function handleFailStudent() {
    failStudentMutate({
      studentsFaileds,
    })

    onSuccess()
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button title="Reprovar" className="bg-red-500 hover:bg-red-400">
          <XCircle size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div>
          <DialogTitle>Confirmar reprovação</DialogTitle>
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
