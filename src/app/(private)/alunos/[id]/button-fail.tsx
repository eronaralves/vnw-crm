'use client'

import { XCircle } from 'lucide-react'
import { Button } from '@/components/button'
import { failStudents } from '@/http/students/fail-students'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'

interface ButtonFailProps {
  studentId: string
  moduleId: string
}

export function ButtonFail({ moduleId, studentId }: ButtonFailProps) {
  const [openModal, setOpenModal] = useState(false)

  const router = useRouter()

  async function handleFailStudent() {
    const response = await failStudents({
      studentsFaileds: [{ id_module: moduleId, id_student: studentId }],
    })

    if (response?.message) {
      return toast.error(response.message, {
        duration: 3000,
        position: 'top-center',
      })
    }

    toast.success('Aluno reprovado com sucesso!', {
      duration: 3000,
      position: 'top-center',
    })

    router.refresh()
    setOpenModal(false)
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
