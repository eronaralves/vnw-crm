'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export type Admin = {
  id: string
  email: string
  fullname: string
  is_active: boolean
  is_admin: boolean
}

interface GetAdminsRquest {
  offset?: number
  limit?: number
}

export async function getAdmins({ limit, offset }: GetAdminsRquest) {
  try {
    const response = await api.get('/user', {
      params: {
        limit,
        offset,
      },
    })
    const data = response.data.results as Admin[]

    const admins = data.filter((admin) => admin.is_admin && admin.is_active)

    return {
      admins,
      count: response.data.count,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar administradores, tente novamente.'

    throw new Error(errorMessage)
  }
}
