'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export async function getOptionsFilters() {
  try {
    const response = await api.get('/students/list/lead/options', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = response.data

    return {
      data,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar filtros, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
