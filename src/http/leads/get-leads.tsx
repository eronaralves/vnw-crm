'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'
import qs from 'qs'

export type Filters = {
  state_in?: string[]
  city_in?: string[]
  gender_in?: string[]
  skin_color_in?: string[]
  interested_course_in?: string[]
  income_range_in?: string[]
  community_in?: string[]
  sexuality_in?: string[]
  age_min?: string
  age_max?: string
  search?: string | null
}

interface GetStudentsRequest {
  offset?: number
  limit?: number
  filters?: Filters
}

type Lead = {
  age: number | null
  email: string
  status: string
  fullname: string
  gender: string
  id: string
  phone: string
  reason_give_up: null
  sexuality: string
  interested_course: string
  skin_color: string
  student_address: {
    address: {
      postal_code: null
      street: string
      number: string
      adjunct: string
      city: string
      district: string
      state: string
    }
    community: string | null
    id: string
    notes: string | null
  }
  student_empregability: {
    interest_area: string
    study: boolean
    work: boolean
  }
  student_socioeconomic_data: {
    income_range: string
  }
}

export async function getLeads({
  offset = 0,
  limit = 7,
  filters,
}: GetStudentsRequest) {
  try {
    const response = await api.get('/students/leads/filter/', {
      params: {
        ...filters,
        offset,
        limit,
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
      count: data.count,
      leads: data.results as Lead[],
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar leads, tente novamente.'

    throw errorMessage
  }
}
