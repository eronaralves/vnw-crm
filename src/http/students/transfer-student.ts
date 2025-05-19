'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

interface TransferStudentRequest {
  studentId: string
  formData: {
    id_old_module: string
    id_new_module: string
  }
}

export async function transferStudent({
  studentId,
  formData,
}: TransferStudentRequest) {
  try {
    await api.post(`/students/transfer/course/${studentId}/`, formData)
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Erro ao tranferir aluno, tente novamente!'

    throw new Error(errorMessage)
  }
}
