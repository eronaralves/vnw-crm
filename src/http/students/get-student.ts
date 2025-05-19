'use server'

import { api } from '@/lib/axios'
import type { STATUS_STUDENT } from '@/types/status-student'
import { AppError } from '@/utils/app-error'

export type ProfileStudent = {
  id: string
  errolmentId: string
  able: boolean
  age: number
  birth_date: Date
  fullname: string
  gender: string
  reason_give_up: string

  cpf: string
  created_at: string
  documents: File[]

  email: string
  emergency_kinship: string
  emergency_name: string
  emergency_phone: string

  emitter: string
  father_name: string
  mother_name: string

  has_algorithm: boolean | null
  has_math: boolean | null

  hometown: string
  hometown_state: string
  indication: string | null

  interested_course: string | null
  interested_modality?: string | null
  interested_time: string | null
  course_enrolled: string | null

  is_active: boolean
  knowledge_languages: string | null

  marital_status: string
  modality: string

  phone: string
  presencial_availability: string | null

  profile_picture: string

  quiz: unknown | null
  quiz_waits: boolean

  religion: string
  rg: string
  sexuality: string
  skin_color: string
  social_name: string

  status: STATUS_STUDENT

  course: {
    id: string
    group: string
    headquarter: string | null
    modality: string | null
    name: string
    programing_language: string | null
    partner: string | null
    status: string
    moduleCurrent: string
    modules: {
      id: string
      name: string
      frequency: number
      desafio: {
        status: string
        github_username: string
        github_repository: string
      } | null
      feedback: {
        message: string
        performance: string
      } | null
    }[]
  }

  student_address: {
    address: {
      postal_code: string
      street: string
      number: string
      adjunct: string
      city: string
      district: string
      state: string
    }
    community: string
    id: string
    notes: string
  }

  student_tecnology: {
    id: string
    previous_experience: boolean
    have_computer: boolean
    have_internet: boolean
    computer_type: string
    internet_type: string
    internet_speed: string | null
    programming_languages: string
    has_programming_knowledge: boolean
  }

  student_empregability: {
    id: string
    work: boolean
    work_role: string
    work_type: string
    work_modality: string
    last_year_job: string
    last_work_role: string
    last_work_type: string
    last_work_modality: string
    years_worked: string
    study: boolean
    study_modality: string
    currently_studying: string
    other_language: boolean
    wich_language: string
    level_language: string
    last_grade: string
    motive_stop_study: string
    intend_study: boolean
    motive_intend_study: string
    interest_area: string
    enterprise_name: string
    partner_empress: boolean
    situation: string | null
    linkedin: string
    recruitment_channel: string
    last_enterprise_name: string
    start_date: Date
    end_date: Date
    created_at: string
  }

  student_responsible?: {
    id?: string
    fullname?: string
    relation?: string
    cpf?: string
    rg?: string
    emitter?: string
    phone?: string
    email?: string
  }

  student_socioeconomic_data: {
    id: string
    housemates: string
    home_type: string
    main_income: string
    live_with_pwd: boolean
    live_with_dwell_pwd: boolean
    pwd_description: string
    cid: string
    have_children: boolean
    home_condition: string
    live_in_community: boolean
    children: string | null
    family_income: string
    income_range: string
    chronic_diseases: string
    government_benefit: string
  }
}

export async function getStudent(id: string) {
  try {
    const response = await api.get(`/enrollment/student/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = response.data[0]

    const student = {
      ...data.id_student,
      status: data.status,
      errolmentId: data.id,
      reason_give_up: data.reason_give_up,
      course: {
        ...data.id_student.course,
        modules: data.id_module,
        moduleCurrent: data.id_student.module,
      },
    } as ProfileStudent

    return {
      student,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao buscar dados do aluno, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
