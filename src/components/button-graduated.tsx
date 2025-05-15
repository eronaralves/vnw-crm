'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Icons
import { GraduationCap } from 'lucide-react'

// Http
import { graduetedStudents } from '@/http/students/graduated-students'

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

interface ButtonGraduatedStudentsProps {
  graduatedStudents: {
    enrollmentId: string
  }[]
  onSuccess: () => void
}

export function ButtonGraduatedStudents({
  graduatedStudents,
  onSuccess,
}: ButtonGraduatedStudentsProps) {
  const [openModal, setOpenModal] = useState(false)

  const queryClient = useQueryClient()
  const { mutate: graduetedStudentsMutate, isPending } = useMutation({
    mutationFn: graduetedStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-students'] })
      queryClient.invalidateQueries({ queryKey: ['get-leads'] })

      toast.success(
        `Aluno${graduatedStudents.length > 1 && 's'} formado${graduatedStudents.length > 1 && 's'} com sucesso`,
        {
          duration: 3000,
          position: 'top-center',
        },
      )

      setOpenModal(false)
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 3000,
        position: 'top-center',
      })
    },
  })

  async function handleFailStudent() {
    const graduatedStudentsData = graduatedStudents.map((student) => {
      return {
        id: student.enrollmentId,
      }
    })

    console.log()

    graduetedStudentsMutate({
      graduatedStudents: graduatedStudentsData,
    })

    onSuccess()
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button title="Formar" className="bg-emerald-600 hover:bg-emerald-500">
          <GraduationCap size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div>
          <DialogTitle>
            Deseja formar aluno{graduatedStudents.length > 1 && 's'}?
          </DialogTitle>
          <DialogDescription className="mt-2">
            Após confirmar não poderá reverter isso.
          </DialogDescription>

          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button
                title="Cancelar"
                className="self-end bg-red-500 hover:bg-red-400"
                disabled={isPending}
              />
            </DialogClose>

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
