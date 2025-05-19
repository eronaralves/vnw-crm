'use server'

import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export type StudentToEdit = {
  age?: number | null
  birth_date?: string | null
  cpf?: string | null
  email?: string | null
  emergency_kinship?: string | null
  emergency_name?: string | null
  emergency_phone?: string | null
  emitter?: string | null
  father_name?: string | null
  fullname?: string | null
  gender?: string | null
  hometown?: string | null
  hometown_state?: string | null
  interested_modality?: string | null
  marital_status?: string | null
  modality?: string | null
  mother_name?: string | null
  phone?: string | null
  reason_give_up?: string | null
  religion?: string | null
  rg?: string | null
  sexuality?: string | null
  skin_color?: string | null
  social_name?: string | null
  student_address?: {
    address?: {
      postal_code?: string | null
      street?: string | null
      number?: string | null
      adjunct?: string | null
      district?: string | null
      city?: string | null
      state?: string | null
    }
    community?: string | null
    notes?: string | null
  } | null
  student_empregability?: {
    currently_studying?: string | null
    enterprise_name?: string | null
    intend_study?: boolean | null
    last_grade?: string | null
    last_work_modality?: string | null
    last_work_role?: string | null
    last_year_job?: string | null
    level_language?: string | null
    linkedin?: string | null
    motive_intend_study?: string | null
    other_language?: boolean | null
    partner_empress?: boolean | null
    study?: boolean | null
    study_modality?: string | null
    wich_language?: string | null
    work?: boolean | null
    work_modality?: string | null
    work_role?: string | null
    work_type?: string | null
    years_worked?: string | null
    start_date?: string | null
    end_date?: string | null
  } | null
  student_responsible?: {
    cpf?: string | null
    email?: string | null
    emitter?: string | null
    fullname?: string | null
    phone?: string | null
    relation?: string | null
    rg?: string | null
  } | null
  student_socioeconomic_data?: {
    chronic_diseases?: string | null
    family_income?: string | null
    government_benefit?: string | null
    have_children?: boolean | null
    home_condition?: string | null
    home_type?: string | null
    housemates?: string | null
    income_range?: string | null
    live_with_pwd?: boolean | null
    main_income?: string | null
  } | null
  student_tecnology?: {
    computer_type?: string | null
    have_computer?: boolean | null
    have_internet?: boolean | null
    internet_speed?: string | null
    internet_type?: string | null
    previous_experience?: boolean | null
    programming_languages?: string | null
  } | null
  under_age?: boolean | null
}

interface EditStudentRequest {
  studentId: string
  formData: StudentToEdit
}

export async function editProfileData({
  studentId,
  formData,
}: EditStudentRequest) {
  try {
    await api.patch(`/students/${studentId}/`, formData)
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Erro ao editar dados, tente novamente!'

    throw new Error(errorMessage)
  }
}
