'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

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

    return {
      data,
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
