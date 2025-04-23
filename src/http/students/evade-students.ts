'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

interface EvadeStudentsRequest {
  studentId: string
  moduleId: string
  enrollmentId: string
  reason_give_up: string
}

export async function evadeStudents({
  enrollmentId,
  moduleId,
  studentId,
  reason_give_up,
}: EvadeStudentsRequest) {
  try {
    await api.post(
      `students/surrender/${studentId}/${moduleId}/${enrollmentId}/`,
      {
        reason_give_up,
      },
    )
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Erro ao evadir aluno(s), tente novamente!'

    return {
      message: errorMessage,
    }
  }
}
