import { useState } from 'react'

import { z } from 'zod'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Http
import { editAdmin } from '@/http/admins/edit-admin'
import type { Admin } from '@/http/admins/get-admins'

// Icons
import { Edit } from 'lucide-react'

// Components
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/input'
import { Button } from '@/components/button'

interface ModalEditCourseProps {
  admin: Admin
}

export const editAdminSchema = z.object({
  fullname: z.string().min(1, 'Digite o nome do curso.'),
})

type EditAdminType = z.infer<typeof editAdminSchema>

export function ModalEditAdmin({ admin }: ModalEditCourseProps) {
  const [openModal, setOpenModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditAdminType>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      fullname: admin.fullname,
    },
  })

  const queryClient = useQueryClient()
  const { mutate: updatedAdmin, isPending } = useMutation({
    mutationFn: editAdmin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['get-admins'] })

      if (data?.message) {
        return toast.error(data.message, {
          duration: 3000,
          position: 'top-center',
        })
      }

      toast.success('Administrador editado com sucesso', {
        duration: 3000,
        position: 'top-center',
      })

      setOpenModal(false)
    },
  })

  async function onSubmit(data: EditAdminType) {
    updatedAdmin({
      id: admin.id,
      formData: data,
    })
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]">
        <Edit size={20} />
        <span className="text-xs">Editar</span>
      </DialogTrigger>

      <DialogContent className="overflow-auto">
        <DialogTitle>Editar Adiministrador</DialogTitle>

        <DialogDescription asChild>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">Nome</label>
              <Input {...register('fullname')} />

              {errors.fullname && (
                <span className="text-xs text-red-500">
                  {errors.fullname.message}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  title="Cancelar"
                  disabled={isPending}
                  className="self-end bg-red-500 hover:bg-red-400"
                />
              </DialogClose>
              <Button
                title="Salvar"
                isPending={isPending}
                className="self-end"
              />
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
