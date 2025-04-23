'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

interface FailStudentsRequest {
  studentsFaileds: {
    id_student: string
    id_module: string
  }[]
}

export async function failStudents({ studentsFaileds }: FailStudentsRequest) {
  try {
    await api.post('/students/failed/', {
      matriculas: studentsFaileds,
    })
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Erro ao reprovar aluno(s), tente novamente!'

    return {
      message: errorMessage,
    }
  }
}
