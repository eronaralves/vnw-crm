'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export type Team = {
  id: string
  fullname: string
  role: 'Instrutor' | 'Facilitador'
  cpf: string
  gender: string
  birth_date: string
  phone: string
  email: string
  admission_date: string
  picture: string
  is_active: boolean
}

export async function getTeams() {
  try {
    const response = await api.get('/employee?limit=100')
    const data = response.data.results as Team[]

    return {
      data,
      count: response.data.count,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar equipe, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
