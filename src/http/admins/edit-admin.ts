'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

interface EditTeamRequest {
  id: string
  formData: {
    fullname: string
  }
}

export async function editAdmin({ id, formData }: EditTeamRequest) {
  try {
    await api.patch(`/user/${id}/`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao editar admin, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
