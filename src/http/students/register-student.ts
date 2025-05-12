'use server'

import type { ProfileNewStudent } from '@/app/(private)/alunos/novo-aluno/content-steps'
import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

interface RegisterStudentRequest {
  formData: Partial<ProfileNewStudent>
  moduleId: string
}

export async function registerStudent({
  moduleId,
  formData,
}: RegisterStudentRequest) {
  try {
    const response = await api.post(
      `students/import/single/${moduleId}/`,
      formData,
    )

    return {
      student: response.data,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Erro ao cadastrar aluno, tente novamente!'

    return {
      message: errorMessage,
    }
  }
}
