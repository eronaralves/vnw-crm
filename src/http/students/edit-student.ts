'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export type StudentToEdit = {
  age: number
  birth_date: string
  cpf: string
  email: string
  emergency_kinship?: string | null
  emergency_name?: string | null
  emergency_phone?: string | null
  emitter?: string
  father_name?: string
  fullname: string
  gender?: string
  hometown: string | null
  hometown_state: string | null
  interested_modality?: string
  marital_status?: string
  modality?: string
  mother_name?: string
  phone: string
  reason_give_up?: string | null
  religion?: string | null
  rg?: string
  sexuality?: string
  skin_color?: string
  social_name?: string
  student_address: {
    address: {
      postal_code?: string
      street?: string
      number?: string
      adjunct?: string
      district?: string
      city?: string
      state?: string
    }
    community: string
    notes: string
  }
  student_empregability: {
    currently_studying?: string | null
    enterprise_name?: string
    intend_study?: boolean
    last_grade?: string
    last_work_modality?: string | null
    last_work_role?: string
    last_year_job?: string | null
    level_language?: string
    linkedin?: string | null
    motive_intend_study: string
    other_language: boolean
    partner_empress: boolean
    study: boolean
    study_modality?: string | null
    wich_language?: string
    work: boolean
    work_modality?: string
    work_role?: string
    work_type?: string
    years_worked?: string | null
    start_date: string
    end_date: string | null
  }
  student_responsible: {
    cpf: string | null
    email: string | null
    emitter: string | null
    fullname: string | null
    phone: string | null
    relation: string | null
    rg: string | null
  }
  student_socioeconomic_data: {
    chronic_diseases: string | null
    family_income?: string
    government_benefit?: string | null
    have_children?: boolean
    home_condition?: string
    home_type?: string
    housemates?: number | null
    income_range?: string
    live_with_pwd?: boolean
    main_income?: string
  }
  student_tecnology: {
    computer_type?: string
    have_computer: boolean
    have_internet: boolean
    internet_speed?: string | null
    internet_type?: string | null
    previous_experience?: boolean
    programming_languages?: string | null
  }
  under_age: boolean
}

interface EditStudentRequest {
  studentId: string
  formData: StudentToEdit
}

export async function editStudent({ studentId, formData }: EditStudentRequest) {
  try {
    await api.patch(`/students/${studentId}/`, formData)
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Erro ao editar dados, tente novamente!'

    throw errorMessage
  }
}
