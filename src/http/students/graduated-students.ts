'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

interface GraduetedStudentsRequest {
  graduatedStudents: { id: string }[]
}

export async function graduetedStudents({
  graduatedStudents,
}: GraduetedStudentsRequest) {
  try {
    await api.put(`/enrollment/graduated/`, {
      enrollment_id_modules: graduatedStudents,
    })
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Erro ao formar aluno(s), tente novamente!'

    throw errorMessage
  }
}
