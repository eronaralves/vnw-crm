'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'
import qs from 'qs'

export type Filters = {
  course_name?: string[]
  group?: string[]
  study?: string[]
  work?: string[]
  state?: string[]
  city?: string[]
  gender?: string[]
  modality?: string[]
  sexuality?: string[]
  programing_language?: string[]
  age_min?: string
  age_max?: string
  status: 'Cursando' | 'Formado' | 'Evadiu' | 'Reprovado'
  search?: string | null
  reason_give_up?: string[]
  community?: string[]
}

interface GetStudentsRequest {
  offset?: number
  limit?: number
  filters?: Filters
}

export type Student = {
  errolmentId: string
  age: number | null
  course: {
    group: string
    headquarter: string | null
    modality: string | null
    name: string
    programing_language: string | null
    partner: string | null
  }
  email: string
  status: string
  fullname: string
  gender: string
  id: string
  phone: string
  reason_give_up: null
  sexuality: string
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
}

export async function getStudents({
  offset = 0,
  limit = 7,
  filters,
}: GetStudentsRequest) {
  try {
    const response = await api.get('/students/filter', {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const students: Student[] = data.results.map((student: any) => {
      return {
        errolmentId: student.id,
        ...student?.id_student,
        reason_give_up: student.reason_give_up,
        status: student.status,
        course: {
          ...student?.id_module.course,
        },
      }
    })

    return {
      count: data.count,
      students,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao listar alunos, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
