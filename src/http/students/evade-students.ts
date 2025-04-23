'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export async function evadeStudents(students: string[]) {
  try {
    await api.post('students/giveup/surrender/several/', {
      students,
    })
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
