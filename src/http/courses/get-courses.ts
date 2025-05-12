'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export type Course = {
  course_modules: {
    id: string
    name: string
  }[]
  created_at: string
  facilitator: {
    fullname: string
    id: string
  }
  finish_date: string
  finish_time: string
  group: string
  headquarter: string
  id: string
  instructor: {
    id: string
    fullname: string
  }
  is_active: boolean
  modality: string
  name: string
  partner: {
    id: string
    name: string
  }
  programing_language: string
  start_date: string
  start_time: string
  status: string
  type_couse: string
  updated_at: string
}

interface GetCoursesRequest {
  offset?: number
  limit?: number
}

export async function getCourses({
  offset = 0,
  limit = 10,
}: GetCoursesRequest) {
  try {
    const response = await api.get('/course/list/courses', {
      params: {
        offset,
        limit,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = response.data
    const courses = data.results as Course[]

    return {
      courses,
      count: data.count,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar cursos, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
