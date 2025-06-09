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
    github_username: string | null
    github_repository: string | null
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
    module_name?: string
  }
}

export async function getJourney({
  limit = 10,
  offset = 0,
  filters,
}: GetJourneyRequest) {
  try {
    const response = await api.get('/students/journey/filter', {
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
      console.log(journey.id_enrollment, 'journey')
      return {
        errolmentId: journey.id,
        id: journey.id_enrollment.id_student.id,
        fullname: journey.id_enrollment.id_student.fullname,
        email: journey.id_enrollment.id_student.email,
        phone: journey.id_enrollment.id_student.phone,
        challenge: {
          github_username: null, // journey.id_enrollment.github_username,
          github_repository: null, // journey.id_enrollment.github_repository,
        },
        frequency: journey.id_enrollment.frequency,
      } as Journey
    })

    console.log(data, 'data')

    return {
      journey,
      count: data.count,
    }
  } catch (error) {
    console.log(error, 'error')

    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar jornadas, tente novamente.'

    throw new Error(errorMessage)
  }
}
