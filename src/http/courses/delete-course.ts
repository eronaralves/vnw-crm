'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export async function deleteCourse(courseId: string) {
  try {
    await api.delete(`/course/delete/${courseId}/`)
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao deletar curso,tente novamente!'

    throw errorMessage
  }
}
