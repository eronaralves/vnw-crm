import { api } from '@/lib/axios'
import { AppError } from '@/utils/app-error'

export type LeadProfile = {
  id: string
  able: boolean
  age: number
  birth_date: string
  fullname: string
  gender: string
  reason_give_up: string | null
  cpf: string
  created_at: string
  documents: unknown[]
  email: string
  emergency_kinship: string | null
  emergency_name: string | null
  emergency_phone: string | null
  emitter: string
  father_name: string
  mother_name: string
  has_algorithm: boolean | null
  has_math: boolean | null
  hometown: string
  hometown_state: string
  indication: string | null
  interested_course: string | null
  interested_modality: string | null
  interested_time: string | null
  course_enrolled: string | null
  is_active: boolean
  knowledge_languages: string | null
  marital_status: string
  modality: string
  module: string
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
  status: string

  student_address: {
    address: {
      postal_code: string | null
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
    currently_studying: string | null
    other_language: boolean
    wich_language: string
    level_language: string
    last_grade: string | null
    motive_stop_study: string | null
    intend_study: boolean
    motive_intend_study: string | null
    interest_area: string
    enterprise_name: string | null
    partner_empress: boolean
    situation: string | null
    linkedin: string | null
    recruitment_channel: string | null
    last_enterprise_name: string | null
    start_date: string | null
    end_date: string | null
    created_at: string
  }

  student_responsible: {
    id: string
    fullname: string
    relation: string
    cpf: string
    rg: string
    emitter: string
    phone: string
    email: string
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

export async function getLead(id: string) {
  try {
    const response = await api.get(`/students/${id}`)
    const lead = response.data as LeadProfile

    return {
      lead,
    }
  } catch (error) {
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao buscar dados do lead, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
