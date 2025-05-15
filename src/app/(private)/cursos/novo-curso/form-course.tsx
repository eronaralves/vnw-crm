'use client'

import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  useForm,
  useFieldArray,
  Controller,
  type Resolver,
} from 'react-hook-form'

// Http
import { getPartners } from '@/http/partners/get-partners'

// Components
import { Input } from '@/components/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/date-picker'
import { getTeams } from '@/http/team/get-teams'
import { Loader2, Trash } from 'lucide-react'
import { addDays, format } from 'date-fns'
import Link from 'next/link'
import { createCourse } from '@/http/courses/create-course'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const formNewCourseSchema = yup.object({
  id: yup.string().required('Digite o ID.'),
  name: yup.string().required('Digite o nome.'),
  start_date: yup.date().required('Data inicial.'),
  finish_date: yup.date().required('Data final.'),
  partner: yup.string().required('Selecione o investidor.'),
  type_couse: yup.string().required('Selecione o tipo.'),
  programing_language: yup.string().required('Digite a linguagem.'),
  group: yup.string().required('Selecione a turma.'),
  instructor: yup.string().required('Selecione o instrutor.'),
  facilitator: yup.string().required('Selecione o facilitador.'),
  start_time: yup.string().required('Horário inicial.'),
  finish_time: yup.string().required('Horário final.'),
  modality: yup.string().required('Selecione o instrutor.'),
  headquarter: yup.string().optional().nullable(),
  course_modules: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Digite o nome do módulo.'),
        start_date: yup.date().required('Data inicial.'),
        end_date: yup.date().required('Data final.'),
      }),
    )
    .min(1, 'Adicione pelo menos um módulo.')
    .required('Os módulos são obrigatórios.'),
})

type FormNewCourseType = yup.InferType<typeof formNewCourseSchema>

export function FormCourse() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormNewCourseType>({
    resolver: yupResolver(formNewCourseSchema) as Resolver<FormNewCourseType>,
    defaultValues: {
      course_modules: [
        {
          name: '',
          end_date: undefined,
          start_date: undefined,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'course_modules',
  })

  const { data: dataPartners, isLoading: loadingPartners } = useQuery({
    queryKey: ['get-partners'],
    queryFn: getPartners,
  })

  const { data: teams, isLoading: loadingTeams } = useQuery({
    queryKey: ['get-teams'],
    queryFn: async () => getTeams({}),
  })

  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-courses'] })

      toast.success('Curso criado com sucesso!', {
        duration: 3000,
        position: 'top-center',
      })

      router.push('/cursos')
    },
    onError: (error) => {
      toast.error(error.message, { duration: 3000, position: 'top-center' })
    },
  })

  const instructors = teams?.data?.filter((team) => team.role === 'Instrutor')
  const facilitators = teams?.data?.filter(
    (team) => team.role === 'Facilitador',
  )

  function onSubmit(course: FormNewCourseType) {
    const courseModule = course.course_modules.map((modulo) => {
      return {
        ...modulo,
        start_date: format(modulo.start_date, 'yyyy-MM-dd'),
        end_date: format(modulo.end_date, 'yyyy-MM-dd'),
      }
    })

    mutate({
      ...course,
      finish_date: format(course.finish_date, 'yyyy-MM-dd'),
      start_date: format(course.start_date, 'yyyy-MM-dd'),
      course_modules: courseModule,
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 flex flex-col overflow-hidden"
    >
      <div className="flex-1 h-full pb-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">ID*</label>
            <Input
              variant="secondary"
              placeholder="Digite o ID"
              {...register('id')}
            />

            {errors.id && (
              <span className="text-xs text-red-500">{errors.id.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Nome do curso</label>
            <Input
              variant="secondary"
              placeholder="Digite o nome"
              {...register('name')}
            />

            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Periodo</label>

            <div className="flex items-start gap-4">
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <div className="flex-1 flex flex-col gap-1">
                    <DatePicker
                      className="w-full"
                      variant="secondary"
                      selected={field.value}
                      onSelect={field.onChange}
                      placeholder="Data inicial"
                      formatDate="dd/MM/yyyy"
                    />

                    {errors.start_date && (
                      <span className="text-xs text-red-500">
                        {errors.start_date.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <Controller
                name="finish_date"
                control={control}
                render={({ field }) => (
                  <div className="flex-1 flex flex-col gap-1">
                    <DatePicker
                      className="w-full"
                      variant="secondary"
                      selected={field.value}
                      onSelect={field.onChange}
                      placeholder="Data final"
                      formatDate="dd/MM/yyyy"
                    />

                    {errors.finish_date && (
                      <span className="text-xs text-red-500">
                        {errors.finish_date.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Investidor</label>

            <Controller
              name="partner"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    variant="secondary"
                    isLoading={loadingPartners}
                  >
                    <SelectValue placeholder="Selecione o investidor" />
                  </SelectTrigger>

                  <SelectContent className="text-gray-900">
                    {dataPartners?.partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.partner && (
              <span className="text-xs text-red-500">
                {errors.partner.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Tipo</label>

            <Controller
              name="type_couse"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger variant="secondary">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>

                  <SelectContent className="text-gray-900">
                    <SelectItem value="Curso">Curso</SelectItem>
                    <SelectItem value="Masterclass">
                      Masterclass/Treinamento
                    </SelectItem>
                    <SelectItem value="Minicurso">Mini curso</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.type_couse && (
              <span className="text-xs text-red-500">
                {errors.type_couse.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Linguagem</label>
            <Input
              variant="secondary"
              placeholder="Digite a linguagem"
              {...register('programing_language')}
            />

            {errors.programing_language && (
              <span className="text-xs text-red-500">
                {errors.programing_language.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Horário</label>

            <div className="flex items-start gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <Controller
                  name="start_time"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger variant="secondary">
                        <SelectValue placeholder="Escolha" />
                      </SelectTrigger>

                      <SelectContent className="text-gray-900">
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="08:30">08:30</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="09:30">09:30</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="10:30">10:30</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.start_time && (
                  <span className="text-xs text-red-500">
                    {errors.start_time.message}
                  </span>
                )}
              </div>

              <div className="py-2">
                <span>ás</span>
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <Controller
                  name="finish_time"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger variant="secondary">
                        <SelectValue placeholder="Escolha" />
                      </SelectTrigger>

                      <SelectContent className="text-gray-900">
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="08:30">08:30</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="09:30">09:30</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="10:30">10:30</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.finish_time && (
                  <span className="text-xs text-red-500">
                    {errors.finish_time.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Turma</label>

            <Controller
              name="group"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger variant="secondary">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>

                  <SelectContent className="text-gray-900">
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Manha">Tarde</SelectItem>
                    <SelectItem value="Noite">Noite</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.group && (
              <span className="text-xs text-red-500">
                {errors.group.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Instrutor</label>

            <Controller
              name="instructor"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger variant="secondary" isLoading={loadingTeams}>
                    <SelectValue placeholder="Selecione o instrutor" />
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
            <label className="text-sm font-normal">Facilitador</label>

            <Controller
              name="facilitator"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger variant="secondary" isLoading={loadingTeams}>
                    <SelectValue placeholder="Selecione o facilitador" />
                  </SelectTrigger>

                  <SelectContent className="text-gray-900">
                    {facilitators?.map((facilitador) => (
                      <SelectItem key={facilitador.id} value={facilitador.id}>
                        {facilitador.fullname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.facilitator && (
              <span className="text-xs text-red-500">
                {errors.facilitator.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Modalidade</label>

            <Controller
              name="modality"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger variant="secondary">
                    <SelectValue placeholder="Selecione a modalidade" />
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
            <label className="text-sm font-normal">Polo</label>

            <Input
              variant="secondary"
              placeholder="Digite o polo"
              {...register('headquarter')}
            />
          </div>
        </div>

        <div className="w-full mt-8 overflow-auto">
          <h3 className="text-lg font-semibold mb-4">Módulos</h3>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex justify-between items-center gap-4 mb-4"
            >
              <div className="flex flex-col gap-1">
                <Input
                  className="flex-1"
                  variant="secondary"
                  placeholder={`Nome do Módulo ${index + 1}`}
                  {...register(`course_modules.${index}.name`)}
                />

                {errors.course_modules?.[index]?.name && (
                  <span className="text-xs text-red-500">
                    {errors.course_modules[index].name.message}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-5">
                <div className="flex-1 flex flex-col gap-1">
                  <Controller
                    control={control}
                    name={`course_modules.${index}.start_date`}
                    render={({ field }) => (
                      <DatePicker
                        className="w-32"
                        variant="secondary"
                        selected={field.value}
                        onSelect={(value) =>
                          value && field.onChange(format(value, 'yyyy-MM-dd'))
                        }
                        placeholder="Data inicial"
                        formatDate="dd/MM/yyyy"
                      />
                    )}
                  />

                  {errors.course_modules?.[index]?.start_date && (
                    <span className="text-xs text-red-500">
                      {errors.course_modules[index].start_date.message}
                    </span>
                  )}
                </div>

                <Controller
                  control={control}
                  name={`course_modules.${index}.end_date`}
                  render={({ field }) => (
                    <div className="flex-1 flex flex-col gap-1">
                      <DatePicker
                        className="w-32"
                        variant="secondary"
                        selected={field.value}
                        onSelect={(value) =>
                          value && field.onChange(format(value, 'yyyy-MM-dd'))
                        }
                        placeholder="Data final"
                        formatDate="dd/MM/yyyy"
                      />

                      {errors.course_modules?.[index]?.end_date && (
                        <span className="text-xs text-red-500">
                          {errors.course_modules[index].end_date.message}
                        </span>
                      )}
                    </div>
                  )}
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="cursor-pointer"
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                name: '',
                start_date: new Date(),
                end_date: addDays(new Date(), 1),
              })
            }
          >
            Adicionar Módulo
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <Link href="/cursos">
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </Link>

        <Button className="cursor-pointer " type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
