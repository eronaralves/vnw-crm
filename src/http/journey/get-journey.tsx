'use server'

import qs from 'qs'
import { api } from '@/lib/axios'
import type { PERFORMANCE } from '@/types/performance-student'
import { AppError } from '@/utils/app-error'

export type Journey = {
  errolmentId: string
  id: string
  fullname: string
  phone: string
  email: string
  frequency: number
  challenge: {
    feedback: {
      performance: PERFORMANCE
    }[]
    github_username: string
    grade: string
    status: string
  }
}

interface GetJourneyRequest {
  offset?: number
  limit?: number
  filters: {
    search?: string
    performance?: string[]
  }
}

export async function getJourney({
  limit = 10,
  offset = 0,
  filters,
}: GetJourneyRequest) {
  try {
    const response = await api.get('/enrollment/journey/', {
      params: {
        limit,
        offset,
        ...filters,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'comma' })
      },
    })
    const data = response.data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const journey: Journey[] = response.data.results.map((journey: any) => {
      return {
        errolmentId: journey.id,
        id: journey.id_student.id,
        fullname: journey.id_student.fullname,
        email: journey.id_student.email,
        phone: journey.id_student.phone,
        challenge: {
          ...journey.activity_grade,
        },
        frequency: journey.frequency,
      } as Journey
    })

    console.log(response.data.results[0])

    return {
      journey,
      count: data.count,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar jornadas, tente novamente.'

    throw new Error(errorMessage)
  }
}
