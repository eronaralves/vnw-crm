'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

interface EditTeamRequest {
  id: string
  formData: FormData
}

export async function editTeam({ id, formData }: EditTeamRequest) {
  try {
    await api.patch(`/employee/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao editar membro, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
