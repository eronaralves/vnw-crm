'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'

// Icons
import { Share } from 'lucide-react'

// Http
import type { Course } from '@/http/courses/get-courses'
import { getAllCourse } from '@/http/courses/get-all-courses'
import { transferStudent } from '@/http/students/transfer-student'

// Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './button'
import { Input } from './input'

export const formCourseSchema = yup.object({
  module_id: yup
    .string()
    .min(1, 'Selecione um módulo.')
    .required('Selecione um módulo'),
})

export type FormCourseType = yup.InferType<typeof formCourseSchema>

interface ButtonTransferStudentsProps {
  studentId: string
  moduleId: string
  onSuccess: () => void
}

export function ButtonTransferStudents({
  studentId,
  moduleId,
  onSuccess,
}: ButtonTransferStudentsProps) {
  const [openModal, setOpenModal] = useState(false)
  const [courseSelected, setCourseSelected] = useState<Course>()

  const {
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormCourseType>()

  const watchModuleId = watch('module_id')

  const {
    data: coursesData,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['get-all-courses'],
    queryFn: getAllCourse,
  })

  const queryClient = useQueryClient()

  const { mutate: transferStudentMutate, isPending } = useMutation({
    mutationFn: transferStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-students'] })

      toast.success('Aluno transferido com sucesso!', {
        duration: 3000,
        position: 'top-center',
      })

      onSuccess()
    },
    onError: (error) => {
      toast.error(error.message, { duration: 3000, position: 'top-center' })
    },
  })

  function onChangeModal() {
    setOpenModal((prev) => !prev)
  }

  function onChangeCourse(courseId: string) {
    const courseSelected = coursesData?.courses?.find(
      (course) => course.id === courseId,
    )

    if (courseSelected) {
      setCourseSelected(courseSelected)
      setValue('module_id', courseSelected.course_modules[0]?.id, {
        shouldTouch: true,
      })
    }
  }

  useEffect(() => {
    if (coursesData?.courses?.length) {
      const firstCourse = coursesData.courses[0]
      setCourseSelected(firstCourse)
      setValue('module_id', firstCourse.course_modules[0]?.id, {
        shouldTouch: true,
      })
    }
  }, [coursesData, setValue])

  return (
    <Dialog open={openModal} onOpenChange={onChangeModal}>
      <DialogTrigger asChild>
        <Button
          title="Transferir"
          className="border border-zinc-500 bg-transparent duration-300 ease-in-out text-zinc-500 hover:bg-zinc-500 hover:text-white"
        >
          <Share size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div>
          <DialogTitle>Deseja tranferir aluno?</DialogTitle>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-6">
            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">Curso ID:</label>

              <Select value={courseSelected?.id} onValueChange={onChangeCourse}>
                <SelectTrigger
                  variant="secondary"
                  isLoading={isFetching || isLoading}
                >
                  <SelectValue placeholder="Selecione o Curso ID" />
                </SelectTrigger>
                <SelectContent className="text-gray-900">
                  {coursesData?.courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">Módulos:</label>

              <Select
                value={watchModuleId}
                onValueChange={(value) => {
                  setValue('module_id', value)
                }}
              >
                <SelectTrigger
                  variant="secondary"
                  isLoading={isFetching || isLoading}
                >
                  <SelectValue placeholder="Selecione o Módulo" />
                </SelectTrigger>
                <SelectContent className="text-gray-900">
                  {courseSelected?.course_modules?.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.module_id && (
                <span className="text-xs text-red-500">
                  {errors.module_id.message}
                </span>
              )}
            </div>
          </div>

          {courseSelected && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-6">
              <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-medium">Nome:</label>
                <Input
                  variant="secondary"
                  value={courseSelected?.name || ''}
                  disabled
                />
              </div>

              <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-medium">Parceiro:</label>
                <Input
                  variant="secondary"
                  value={courseSelected?.partner?.name || ''}
                  disabled
                />
              </div>

              <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-medium">Turno:</label>
                <Input
                  variant="secondary"
                  value={courseSelected?.group || ''}
                  disabled
                />
              </div>

              <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-medium">Modalidade:</label>
                <Input
                  variant="secondary"
                  value={courseSelected?.modality || ''}
                  disabled
                />
              </div>
            </div>
          )}

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
              onClick={() =>
                transferStudentMutate({
                  studentId,
                  formData: {
                    id_old_module: moduleId,
                    id_new_module: watchModuleId,
                  },
                })
              }
              isPending={isPending}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
