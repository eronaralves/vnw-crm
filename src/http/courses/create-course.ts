'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

type CreateCourseRequest = {
  headquarter?: string | null | undefined
  id: string
  name: string
  start_date: string
  finish_date: string
  partner: string
  type_couse: string
  programing_language: string
  group: string
  instructor: string
  facilitator: string
  start_time: string
  finish_time: string
  modality: string
  course_modules: {
    name: string
    start_date: string
    end_date: string
  }[]
}

export async function createCourse(course: CreateCourseRequest) {
  try {
    await api.post('/course/', course)
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao criar curso,tente novamente!'

    throw new Error(errorMessage)
  }
}
