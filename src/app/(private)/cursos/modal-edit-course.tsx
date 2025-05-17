import { useState } from 'react'

import { z } from 'zod'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { UTCDate } from '@date-fns/utc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Http
import { getTeams } from '@/http/team/get-teams'
import { editCourse } from '@/http/courses/edit-course'
import type { Course } from '@/http/courses/get-courses'
import { getPartners } from '@/http/partners/get-partners'

// Icons
import { Edit } from 'lucide-react'

// Utils
import { generateHours } from '@/utils/generate-hours'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/date-picker'
import { useSearchParams } from 'next/navigation'

interface ModalEditCourseProps {
  course: Course
}

export const editCourseSchema = z.object({
  name: z.string().min(1, 'Digite o nome do curso.'),
  programing_language: z.string(),
  partner: z.string().optional(),
  group: z.string(),
  instructor: z.string().min(1, 'Selecione um instrutor'),
  facilitador: z.string().min(1, 'Selecione um facilitador'),
  modality: z
    .string({
      message: 'Selecione a modalidade',
    })
    .min(1, 'Selecione a modalidade'),
  headquarter: z.string().optional(),
  name_doc_site: z.string().optional(),
  start_date: z.date(),
  start_time: z.string(),
  finish_date: z.date(),
  finish_time: z.string(),
})

type EditCourseType = z.infer<typeof editCourseSchema>

export function ModalEditCourse({ course }: ModalEditCourseProps) {
  const [openModal, setOpenModal] = useState(false)

  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? '1'

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<EditCourseType>({
    resolver: zodResolver(editCourseSchema),
    defaultValues: {
      ...course,
      facilitador: course.facilitator.id,
      instructor: course.instructor.id,
      partner: course.partner?.id,
      finish_date: new UTCDate(course.finish_date),
      start_date: new UTCDate(course.start_date),
    },
  })

  const { data: dataPartners, isLoading: loadingPartners } = useQuery({
    queryKey: ['get-partners', page],
    queryFn: async () => getPartners(),
    enabled: openModal,
  })

  const { data: teams, isLoading: loadingTeams } = useQuery({
    queryKey: ['get-teams', page],
    queryFn: async () => getTeams({}),
    enabled: openModal,
  })

  const queryClient = useQueryClient()
  const { mutate: updatedCourse, isPending } = useMutation({
    mutationFn: editCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['get-courses'] })

      if (data?.message) {
        return toast.error(data.message, {
          duration: 3000,
          position: 'top-center',
        })
      }

      toast.success('Curso editado com sucesso', {
        duration: 3000,
        position: 'top-center',
      })

      setOpenModal(false)
    },
  })

  const watchStartTime = watch('start_time')
  const watchStartDate = watch('start_date')

  const hours = generateHours()
  const instructors = teams?.data?.filter((team) => team.role === 'Instrutor')
  const facilitators = teams?.data?.filter(
    (team) => team.role === 'Facilitador',
  )

  async function onSubmit(data: EditCourseType) {
    const formData = {
      ...data,
      finish_date: format(new UTCDate(data.finish_date), 'yyyy-MM-dd'),
      start_date: format(new UTCDate(data.start_date), 'yyyy-MM-dd'),
    }

    updatedCourse({
      id: course.id,
      formData,
    })
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger className="flex flex-col items-center gap-1 cursor-pointer text-[#0f2b92]">
        <Edit size={20} />
        <span className="text-xs">Editar</span>
      </DialogTrigger>

      <DialogContent className="h-[70%] overflow-auto">
        <DialogTitle>Editar Curso</DialogTitle>

        <DialogDescription asChild>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Nome do curso
              </label>
              <Input {...register('name')} />

              {errors.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Linguagem
              </label>
              <Input {...register('programing_language')} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Investidor
              </label>
              <Controller
                name="partner"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      disabled={loadingPartners}
                      isLoading={loadingPartners}
                      className="focus:ring-1 focus:ring-blue-500 w-full text-gray-900 border border-[#0f2b92] py-2 px-3 text-sm  rounded-none"
                    >
                      <SelectValue placeholder="Selecione um investidor" />
                    </SelectTrigger>

                    <SelectContent className="text-gray-900">
                      {dataPartners?.partners?.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Horario
              </label>

              <div className="flex items-center gap-4">
                <Controller
                  name="start_time"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="focus:ring-1 focus:ring-blue-500 w-full text-gray-900 border border-[#0f2b92] py-2 px-3 text-sm  rounded-none">
                        <SelectValue placeholder="15:00" />
                      </SelectTrigger>

                      <SelectContent className="text-gray-900">
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <span>às</span>

                <Controller
                  name="finish_time"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="focus:ring-1 focus:ring-blue-500 w-full text-gray-900 border border-[#0f2b92] py-2 px-3 text-sm  rounded-none">
                        <SelectValue placeholder="15:00" />
                      </SelectTrigger>

                      <SelectContent className="text-gray-900">
                        {hours.map((hour) => {
                          if (`${hour}:00` > watchStartTime) {
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}
                              </SelectItem>
                            )
                          }

                          return null
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Perido
              </label>

              <div className="flex items-center gap-4">
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  )}
                />

                <span>às</span>

                <Controller
                  name="finish_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onSelect={field.onChange}
                      minDate={watchStartDate}
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Turno
              </label>
              <Input {...register('group')} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Instrutor
              </label>

              <Controller
                name="instructor"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      disabled={loadingTeams}
                      isLoading={loadingTeams}
                      className="focus:ring-1 focus:ring-blue-500 w-full text-gray-900 border border-[#0f2b92] py-2 px-3 text-sm  rounded-none"
                    >
                      <SelectValue placeholder="Selecione um instrutor" />
                    </SelectTrigger>

                    <SelectContent className="text-gray-900">
                      {instructors?.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.fullname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.instructor && (
                <span className="text-xs text-red-500">
                  {errors.instructor.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Facilitador
              </label>
              <Controller
                name="facilitador"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      disabled={loadingTeams}
                      isLoading={loadingTeams}
                      className="focus:ring-1 focus:ring-blue-500 w-full text-gray-900 border border-[#0f2b92] py-2 px-3 text-sm  rounded-none"
                    >
                      <SelectValue placeholder="Selecione um facilitador" />
                    </SelectTrigger>

                    <SelectContent className="text-gray-900">
                      {facilitators?.map((facilitator) => (
                        <SelectItem key={facilitator.id} value={facilitator.id}>
                          {facilitator.fullname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.facilitador && (
                <span className="text-xs text-red-500">
                  {errors.facilitador.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Modalidade
              </label>
              <Controller
                name="modality"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full text-gray-900  border border-[#0f2b92] py-2 px-3 text-sm outline-none rounded-none">
                      <SelectValue
                        placeholder="15:00"
                        className="text-gray-900"
                      />
                    </SelectTrigger>

                    <SelectContent className="text-gray-900">
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.modality && (
                <span className="text-xs text-red-500">
                  {errors.modality.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">Polo</label>
              <Input type="text" {...register('headquarter')} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#0f2b92]">
                Link do material
              </label>
              <Input type="text" {...register('name_doc_site')} />
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
