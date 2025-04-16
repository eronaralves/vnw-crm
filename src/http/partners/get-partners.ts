'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

type Partner = {
  id: string
  name: string
  address: null
  cnpj: string
  company_name: string
  cycle: string
  enterprise_email: string
  investment: string
  partner_contact: string
  year: number
}

export async function getPartners() {
  try {
    const response = await api.get('/partners?limit=100')
    const partners = response.data.results as Partner[]

    console.log(response, 'FFF')

    return {
      partners,
      count: response.data.count,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar parceiros, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
