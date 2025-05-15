'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Icons
import { Trash } from 'lucide-react'

// Http
import { deleteCourse } from '@/http/courses/delete-course'

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

interface ButtonDeleteProps {
  courseId: string
}

export function ButtonDelete({ courseId }: ButtonDeleteProps) {
  const [openModal, setOpenModal] = useState(false)

  const queryClient = useQueryClient()
  const { mutate: deleteCourseMutate, isPending } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success('Curso deletado com sucesso!', {
        duration: 3000,
        position: 'top-center',
      })
      queryClient.invalidateQueries({ queryKey: ['get-courses'] })
      setOpenModal(false)
    },
    onError: (error) => {
      toast.error(error.message, { duration: 3000, position: 'top-center' })
    },
  })

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <button
          onClick={() => setOpenModal(true)}
          className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]"
        >
          <Trash size={20} />
          <span className="text-xs">Deletar</span>
        </button>
      </DialogTrigger>

      <DialogContent>
        <div>
          <DialogTitle>Deseja deletar?</DialogTitle>

          <DialogDescription className="mt-4 text-sm">
            Após confirmar não poderá reverter isso.
          </DialogDescription>

          <div className="flex justify-end gap-2 mt-4">
            <DialogClose>
              <Button
                title="Cancelar"
                className="self-end bg-red-500 hover:bg-red-400"
                disabled={isPending}
              />
            </DialogClose>

            <Button
              title="Confirmar"
              onClick={() => deleteCourseMutate(courseId)}
              isPending={isPending}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
