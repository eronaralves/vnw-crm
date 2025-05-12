'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export async function registerDocuments(formData: FormData) {
  try {
    await api.post('/students/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Erro ao cadastrar documentos, acesso o perfil do aluno para atualizar!'

    return {
      message: errorMessage,
    }
  }
}
