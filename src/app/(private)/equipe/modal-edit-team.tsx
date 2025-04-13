'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import Image from 'next/image'

import { z } from 'zod'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { UTCDate } from '@date-fns/utc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'

// Http
import { type Team } from '@/http/team/get-teams'

// Icons
import { Edit, Pencil } from 'lucide-react'

// Images
import UserProfileDefault from '@/assets/images/profile-default.webp'

// Utils
import { cn } from '@/lib/utils'
import { formatCpf } from '@/utils/format-cpf'

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
import { DatePicker } from '@/components/date-picker'
import { Button as UiButton } from '@/components/ui/button'
import { editTeam } from '@/http/team/edit-team'

interface ModalEditCourseProps {
  team: Team
}

export const editCourseSchema = z.object({
  fullname: z.string().min(1, 'Digite o nome.'),
  cpf: z.string().min(1, 'Digite o cpf.').length(14, 'Digite o CPF completo'),
  role: z.enum(['Instrutor', 'Facilitador']),
  phone: z.string(),
  email: z.string().min(1, 'Digite o email.').email('Digite um e-mail válido'),
  picture: z.union([z.instanceof(File), z.string().url()]),
  birth_date: z.date(),
  admission_date: z.date(),
  gender: z.string(),
})

type EditTeamType = z.infer<typeof editCourseSchema>

export function ModalEditTeam({ team }: ModalEditCourseProps) {
  const [openModal, setOpenModal] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<EditTeamType>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      ...team,
      cpf: formatCpf(team.cpf),
      birth_date: new UTCDate(team.birth_date),
      admission_date: new UTCDate(team.admission_date),
    },
  })

  const refInputPicture = useRef<HTMLInputElement | null>(null)
  const watchRole = watch('role')
  const watchPicture = watch('picture')

  const queryClient = useQueryClient()
  const { mutate: updatedTeam, isPending } = useMutation({
    mutationFn: editTeam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['get-teams'] })

      if (data?.message) {
        return toast.error(data.message, {
          duration: 3000,
          position: 'top-center',
        })
      }

      toast.success('Membro editado com sucesso', {
        duration: 3000,
        position: 'top-center',
      })

      setOpenModal(false)
    },
  })
  function onOpenChange(open: boolean) {
    setOpenModal(open)
    reset()
  }

  function onChangePicture(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (file) {
      setValue('picture', file)
    }
  }

  async function onSubmit(data: EditTeamType) {
    const formData = new FormData()

    formData.append('role', data.role)
    formData.append(
      'admission_date',
      format(new UTCDate(data.admission_date), 'yyyy-MM-dd'),
    )
    formData.append('fullname', data.fullname)
    formData.append('cpf', data.cpf)
    formData.append('gender', data.gender)
    formData.append(
      'birth_date',
      format(new UTCDate(data.birth_date), 'yyyy-MM-dd'),
    )
    formData.append('phone', data.phone)
    formData.append('email', data.email)

    updatedTeam({
      id: team.id,
      formData,
    })
  }

  console.log(team, 'FF')

  return (
    <Dialog open={openModal} onOpenChange={onOpenChange}>
      <DialogTrigger className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]">
        <Edit size={20} />
        <span className="text-xs">Editar</span>
      </DialogTrigger>

      <DialogContent className="h-[70%] overflow-auto">
        <DialogTitle>Editar Membro</DialogTitle>

        <DialogDescription asChild>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="w-full flex justify-center">
              <div
                className="relative cursor-pointer"
                onClick={() => refInputPicture.current?.click()}
              >
                {!watchPicture ? (
                  <Image
                    src={UserProfileDefault}
                    alt="Imagem padrão do membro"
                    width={100}
                    height={100}
                    className="w-22 h-22 rounded-full object-cover"
                    priority
                  />
                ) : typeof watchPicture === 'string' ? (
                  <Image
                    src={watchPicture}
                    alt="Imagem de perfl do membro"
                    width={100}
                    height={100}
                    className="w-22 h-22 rounded-full object-cover"
                    priority
                  />
                ) : (
                  <Image
                    src={URL.createObjectURL(watchPicture)}
                    alt="Imagem de perfl do membro"
                    width={100}
                    height={100}
                    className="w-22 h-22 rounded-full object-cover"
                  />
                )}

                <input
                  ref={refInputPicture}
                  type="file"
                  onChange={onChangePicture}
                  className="hidden"
                />

                <div className=" bg-[#0f2b92] absolute right-0 -bottom-1 rounded-full p-2 z-30">
                  <Pencil color="#fff" size={18} />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-between gap-4">
              <div className="flex-1 flex flex-col gap-1 mt-4">
                <label className="text-sm font-medium text-[#0f2b92]">
                  Data de registro
                </label>

                <Controller
                  name="admission_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-1 mt-4">
                <label className="text-sm font-medium text-[#0f2b92]">
                  Função
                </label>

                <div className="flex items-center gap-2">
                  <UiButton
                    className={cn(
                      'text-[#0f2b92] border border-[#0f2b92]',
                      watchRole === 'Instrutor' &&
                        'bg-[#0f2b92] hover:bg-[#0f2b92]  text-white',
                    )}
                    onClick={() => setValue('role', 'Instrutor')}
                    variant={watchRole === 'Instrutor' ? 'default' : 'outline'}
                  >
                    Instrutor
                  </UiButton>
                  <UiButton
                    onClick={() => setValue('role', 'Facilitador')}
                    className={cn(
                      'text-[#0f2b92] border border-[#0f2b92]',
                      watchRole === 'Facilitador' &&
                        'bg-[#0f2b92] hover:bg-[#0f2b92] text-white ',
                    )}
                    variant={
                      watchRole === 'Facilitador' ? 'default' : 'outline'
                    }
                  >
                    Facilitador
                  </UiButton>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">Nome</label>
              <Input {...register('fullname')} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                E-mail
              </label>
              <Input {...register('email')} />

              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">CPF</label>
              <Input
                {...register('cpf')}
                onChange={(e) => {
                  const formatted = formatCpf(e.target.value)
                  setValue('cpf', formatted, { shouldValidate: isSubmitted })
                }}
                maxLength={14}
              />

              {errors.cpf && (
                <span className="text-xs text-red-500">
                  {errors.cpf.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Celular
              </label>
              <Input {...register('phone')} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Gênero
              </label>
              <Input {...register('gender')} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Data de nasc.
              </label>

              <Controller
                name="birth_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  title="Cancelar"
                  disabled={isPending}
                  onClick={() => onOpenChange(true)}
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
