'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'
import type { Course } from './get-courses'

export async function getAllCourse() {
  try {
    const response = await api.get('/course/list/module', {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const courses: Course[] = response.data

    return { courses }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar módulos, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
