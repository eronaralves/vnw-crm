'use client'

import * as yup from 'yup'
import { Controller, useFormContext } from 'react-hook-form'

// Components
import { Input } from '../input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// Http
import type { Course } from '@/http/courses/get-courses'
import { getAllCourse } from '@/http/courses/get-all-courses'

export const formCourseSchema = yup.object({
  module_id: yup.string().min(1, 'Selecione um módulo.'),
})

export type FormCourseType = yup.InferType<typeof formCourseSchema>

export function StepCourse() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormCourseType>()

  const watchModuleId = watch('module_id')

  const {
    data: coursesData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['get-all-courses'],
    queryFn: async () =>
      await getAllCourse().then((res) => {
        if (res.courses) {
          setCourseSelect(res.courses[0])
        }

        return res
      }),
  })

  const filterSelected = coursesData?.courses?.filter((item) =>
    item.course_modules.find((modulo) => modulo.id === watchModuleId),
  ) as Course | undefined

  const [courseSelect, setCourseSelect] = useState<Course | undefined>(
    filterSelected,
  )

  function onChangeCourse(courseId: string) {
    const courseSelected = coursesData?.courses?.find(
      (course) => course.id === courseId,
    )

    if (courseSelected) {
      setCourseSelect(courseSelected)
      setValue('module_id', '', { shouldTouch: true })
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex-1 flex flex-col space-y-6 overflow-auto">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-semibold">Cadastro do Curso</h2>

          <div className="flex flex-wrap gap-x-4 gap-y-6">
            <div className="w-full max-w-sm flex flex-col gap-1">
              <label className="text-sm font-medium">Curso ID:</label>

              <Select value={courseSelect?.id} onValueChange={onChangeCourse}>
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

            <div className="w-full max-w-sm flex flex-col gap-1">
              <label className="text-sm font-medium">Módulos:</label>

              <Controller
                name="module_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <SelectTrigger
                      variant="secondary"
                      isLoading={isFetching || isLoading}
                    >
                      <SelectValue placeholder="Selecione o Módulo" />
                    </SelectTrigger>
                    <SelectContent className="text-gray-900">
                      {courseSelect?.course_modules?.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.module_id && (
                <span className="text-xs text-red-500">
                  {errors.module_id.message}
                </span>
              )}
            </div>
          </div>

          {courseSelect && (
            <div className="flex flex-wrap gap-x-4 gap-y-6">
              <div className="w-full max-w-sm flex flex-col gap-1">
                <label className="text-sm font-medium">Nome:</label>
                <Input
                  variant="secondary"
                  value={courseSelect?.name || ''}
                  disabled
                />
              </div>

              <div className="w-full max-w-sm flex flex-col gap-1">
                <label className="text-sm font-medium">Parceiro:</label>
                <Input
                  variant="secondary"
                  value={courseSelect?.partner?.name || ''}
                  disabled
                />
              </div>

              <div className="w-full max-w-sm flex flex-col gap-1">
                <label className="text-sm font-medium">Turno:</label>
                <Input
                  variant="secondary"
                  value={courseSelect?.group || ''}
                  disabled
                />
              </div>

              <div className="w-full max-w-sm flex flex-col gap-1">
                <label className="text-sm font-medium">Modalidade:</label>
                <Input
                  variant="secondary"
                  value={courseSelect?.modality || ''}
                  disabled
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
