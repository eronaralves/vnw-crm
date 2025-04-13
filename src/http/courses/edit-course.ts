'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

interface EditCourseRequest {
  id: string
  formData: {
    name: string
    programing_language: string
    group: string
    instructor: string
    facilitador: string
    modality: string
    start_date: string
    start_time: string
    finish_date: string
    finish_time: string
    partner?: string | undefined
    headquarter?: string | undefined
    name_doc_site?: string | undefined
  }
}

export async function editCourse({ id, formData }: EditCourseRequest) {
  try {
    await api.patch(`/course/${id}/`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao editar curso, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
