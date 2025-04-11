'use server'

import qs from 'qs'
import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'
import type { Filters } from './get-students'

interface ExportStudentsRequest {
  filters?: Filters
}

export async function exportStudents({ filters }: ExportStudentsRequest) {
  try {
    const response = await api.get('/students/export/student/', {
      params: {
        ...filters,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'comma' })
      },
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
      : 'Error ao exportar planilha, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
