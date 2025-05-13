'use client'

import { useState } from 'react'

import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import type { AnyObjectSchema } from 'yup'

import { toast } from 'sonner'
import { format } from 'date-fns'

// Types
import type { STATUS_STUDENT } from '@/types/status-student'

// Http
// import { registerDocuments } from '@/http/students/create-documents'

// Components
import { Button } from '@/components/button'
import { StepProgressBar } from '@/components/progress-bar'

// Steps
import {
  formPersonalSchema,
  StepPersonalData,
} from '@/components/steps/step-personal-data'
import {
  formSocioeconomicSchema,
  StepSocioeconomicData,
} from '@/components/steps/step-socioeconomic-data'
import {
  formTechnologySchema,
  StepTechnology,
} from '@/components/steps/step-technology'
import {
  formEmpregabilitySchema,
  StepEmpregability,
} from '@/components/steps/step-employability'
import { formAnnexesSchema, StepAnnexes } from '@/components/steps/step-annexes'

enum STEPS {
  PERSONAL = 0,
  SOCIO_ECONOMIC = 1,
  TECHNOLOGY = 2,
  EMPREGABILITY = 3,
  ANNEXES = 4,
}

export type ProfileNewLead = {
  able?: boolean
  age?: number
  birth_date: string
  fullname: string
  gender?: string

  cpf: string
  created_at?: string
  documents: File[]

  email: string
  emergency_kinship?: string
  emergency_name?: string
  emergency_phone?: string

  emitter?: string
  father_name?: string
  mother_name?: string

  has_algorithm?: boolean
  has_math?: boolean

  hometown?: string
  hometown_state?: string
  indication?: string

  interested_course?: string
  interested_modality?: string
  interested_time?: string
  course_enrolled?: string

  knowledge_languages?: string

  marital_status?: string
  modality?: string

  phone: string
  presencial_availability?: string

  profile_picture?: string

  religion?: string
  rg?: string
  sexuality?: string
  skin_color?: string
  social_name?: string

  status?: STATUS_STUDENT

  student_address: {
    address: {
      postal_code?: string
      street?: string
      number?: string
      adjunct?: string
      city?: string
      district?: string
      state?: string
    }
    community?: string
    id?: string
    notes?: string
  }

  student_tecnology: {
    previous_experience?: boolean
    have_computer?: boolean
    have_internet?: boolean
    computer_type?: string
    internet_type?: string
    internet_speed?: string
    programming_languages?: string
    has_programming_knowledge?: boolean
  }

  student_empregability: {
    id?: string
    work?: boolean
    work_role?: string
    work_type?: string
    work_modality?: string
    last_year_job?: string
    last_work_role?: string
    last_work_type?: string
    last_work_modality?: string
    years_worked?: string
    study?: boolean
    study_modality?: string
    currently_studying?: string
    other_language?: boolean
    wich_language?: string
    level_language?: string
    last_grade?: string
    motive_stop_study?: string
    intend_study?: boolean
    motive_intend_study?: string
    interest_area?: string
    enterprise_name?: string
    partner_empress?: boolean
    situation?: string
    linkedin?: string
    recruitment_channel?: string
    last_enterprise_name?: string
    start_date?: string
    end_date?: string
    created_at?: string
  }

  student_responsible: {
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
    housemates?: string
    home_type?: string
    main_income?: string
    live_with_pwd?: boolean
    live_with_dwell_pwd?: boolean
    pwd_description?: string
    cid?: string
    have_children?: boolean
    home_condition?: string
    live_in_community?: boolean
    children?: string
    family_income?: string
    income_range?: string
    chronic_diseases?: string
    government_benefit?: string
  }
}

export function ContentSteps() {
  const [step, setStep] = useState(STEPS.PERSONAL)

  const schemaByStep: Record<STEPS, AnyObjectSchema> = {
    [STEPS.PERSONAL]: formPersonalSchema,
    [STEPS.SOCIO_ECONOMIC]: formSocioeconomicSchema,
    [STEPS.TECHNOLOGY]: formTechnologySchema,
    [STEPS.EMPREGABILITY]: formEmpregabilitySchema,
    [STEPS.ANNEXES]: formAnnexesSchema,
  }

  const methods = useForm({
    resolver: yupResolver(schemaByStep[step]),
  })

  async function onSubmit(data: Partial<ProfileNewLead>) {
    const student = data as ProfileNewLead

    if (step !== STEPS.ANNEXES) {
      return setStep(step + 1)
    }

    const studentData = {
      ...student,
      module_id: undefined,
      documents: undefined,
      phone: student.phone?.replace(/\D/g, ''),
      birth_date: format(student.birth_date, 'yyyy-MM-dd'),
      student_empregability: {
        ...student.student_empregability,
        start_date: format(
          student?.student_empregability?.start_date || new Date(),
          'yyyy-MM-dd',
        ),
        end_date: format(
          student?.student_empregability?.end_date || new Date(),
          'yyyy-MM-dd',
        ),
      },
    }

    delete studentData.documents

    // const responseRegister = await registerStudent({
    //   moduleId: student.module_id,
    //   formData: studentData,
    // })

    // if (responseRegister?.message) {
    //   return toast.error(responseRegister.message, {
    //     duration: 3000,
    //     position: 'top-center',
    //   })
    // }

    // if (student.documents && student.documents?.length > 0) {
    //   for (let i = 0; i < student?.documents?.length; i++) {
    //     const formData = new FormData()
    //     formData.append('document', student.documents[i])
    //     formData.append('students', responseRegister.student.id)

    //     const responseDocuments = await registerDocuments(formData)

    //     if (responseDocuments?.message) {
    //       toast.error(responseRegister.message, {
    //         duration: 3000,
    //         position: 'top-center',
    //       })
    //     }
    //   }
    // }

    toast.success('Aluno cadastrado com sucesso!', {
      duration: 3000,
      position: 'top-center',
    })
    methods.reset()
    setStep(STEPS.PERSONAL)
  }

  return (
    <FormProvider {...methods}>
      <div className="h-full flex flex-col gap-8 overflow-hidden">
        <StepProgressBar
          step={step}
          setStep={setStep}
          stepsLabel={[
            'Pessoais',
            'Socioeconômicos',
            'Tecnologia',
            'Empregabilidade',
            'Upload de Anexos',
            'Curso',
          ]}
        />

        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex-1 flex flex-col gap-4 px-6 py-8 pb-4 rounded-3xl bg-white overflow-auto"
        >
          {step === STEPS.PERSONAL && <StepPersonalData />}
          {step === STEPS.SOCIO_ECONOMIC && <StepSocioeconomicData />}
          {step === STEPS.TECHNOLOGY && <StepTechnology />}
          {step === STEPS.EMPREGABILITY && <StepEmpregability />}
          {step === STEPS.ANNEXES && <StepAnnexes />}

          <div className="w-full flex justify-end gap-3">
            <Button
              type="button"
              title="Voltar"
              className="bg-[#5e81f418] hover:!bg-[#00000018] !text-[#0f2b92]"
            />
            <Button title="Salvar" />
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
