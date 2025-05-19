'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'

import { toast } from 'sonner'
import { UTCDate } from '@date-fns/utc'
import { format } from 'date-fns'

// Utils
import { dateDiff } from '@/utils/date-diff'

// Http
import { registerStudent } from '@/http/students/register-student'
import { registerDocuments } from '@/http/documents/register-documents'

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
import { formCourseSchema, StepCourse } from '@/components/steps/step-course'

enum STEPS {
  PERSONAL = 0,
  SOCIO_ECONOMIC = 1,
  TECHNOLOGY = 2,
  EMPREGABILITY = 3,
  ANNEXES = 4,
  COURSE = 5,
}

const fullSchema = formPersonalSchema
  .concat(formSocioeconomicSchema)
  .concat(formTechnologySchema)
  .concat(formEmpregabilitySchema)
  .concat(formAnnexesSchema)
  .concat(formCourseSchema)

type FormData = yup.InferType<typeof fullSchema>

export function ContentSteps() {
  const [step, setStep] = useState(STEPS.PERSONAL)
  const [isPending, setIsPending] = useState(false)

  const schemaByStep: Record<STEPS, yup.AnyObjectSchema> = {
    [STEPS.PERSONAL]: formPersonalSchema,
    [STEPS.SOCIO_ECONOMIC]: formSocioeconomicSchema,
    [STEPS.TECHNOLOGY]: formTechnologySchema,
    [STEPS.EMPREGABILITY]: formEmpregabilitySchema,
    [STEPS.ANNEXES]: formAnnexesSchema,
    [STEPS.COURSE]: formCourseSchema,
  }

  const methods = useForm({
    resolver: yupResolver(schemaByStep[step]),
  })

  const router = useRouter()

  async function onSubmit(data: FormData) {
    // check if it is the last step
    if (step !== STEPS.COURSE) {
      return setStep(step + 1)
    }

    try {
      setIsPending(true)

      const age = dateDiff({
        from: new UTCDate(data.birth_date),
        to: new UTCDate(),
      })

      const studentData = {
        age,
        phone: data.phone.replace(/[()\-\s]/g, ''),
        birth_date: format(new UTCDate(data.birth_date), 'yyyy-MM-dd'),
        cpf: data.cpf,
        email: data.email,
        emergency_kinship: data.emergency_kinship,
        emergency_name: data.emergency_name,
        emergency_phone: data.emergency_phone,
        emitter: data.emitter,
        father_name: data.father_name ?? '',
        fullname: data.fullname,
        gender: data.gender,
        hometown: null,
        hometown_state: null,
        interested_modality: '',
        marital_status: data.marital_status,
        modality: '',
        mother_name: data.mother_name ?? '',
        religion: null,
        rg: data.rg,
        sexuality: data.sexuality,
        skin_color: data.skin_color,
        social_name: data.social_name,
        student_address: {
          ...data.student_address,
          address: {
            postal_code: data.student_address.address.postal_code ?? '',
            street: data.student_address.address.street,
            number: data.student_address.address.number,
            adjunct: data.student_address.address.adjunct,
            district: data.student_address.address.district,
            city: data.student_address.address.city,
            state: data.student_address.address.state,
          },
          community: data.student_address.community ?? '',
          notes: data.student_address.notes ?? '',
        },
        student_responsible: {
          cpf: data?.student_responsible?.cpf ?? null,
          email: data?.student_responsible?.email ?? null,
          emitter: data?.student_responsible?.emitter ?? null,
          fullname: data?.student_responsible?.fullname ?? null,
          phone:
            data?.student_responsible?.phone?.replace(/[()\-\s]/g, '') ?? null,
          relation: data?.student_responsible?.relation ?? null,
          rg: data?.student_responsible?.rg ?? null,
        },
        student_empregability: {
          ...data.student_empregability,
          start_date: format(
            data.student_empregability.start_date,
            'yyyy-MM-dd',
          ),
          end_date: data.student_empregability.end_date
            ? format(data.student_empregability.end_date, 'yyyy-MM-dd')
            : null,
          currently_studying: data.student_empregability.currently_studying,
          enterprise_name: data.student_empregability.enterprise_name ?? '',
          intend_study: data.student_empregability.intend_study ?? undefined,
          last_grade: data.student_empregability.last_grade ?? '',
          last_work_modality:
            data.student_empregability.last_work_modality ?? null,
          last_work_role: data.student_empregability.last_work_role,
          last_year_job: null,
          level_language: data.student_empregability.level_language,
          linkedin: data.linkedin,
          motive_intend_study:
            data.student_empregability.motive_intend_study ?? '',
          other_language: data.student_empregability.other_language,
          partner_empress: data.student_empregability.partner_empress,
          study: data.student_empregability.study,
          study_modality: data.student_empregability.study_modality ?? null,
          wich_language: data.student_empregability.wich_language,
          work: data.student_empregability.work,
          work_modality: data.student_empregability.work_modality,
          work_role: data.student_empregability.work_role,
          work_type: data.student_empregability.work_type,
          years_worked: data.student_empregability.years_worked ?? null,
        },
        student_socioeconomic_data: {
          ...data.student_socioeconomic_data,
          family_income: '',
          have_children: false,
        },
        student_tecnology: {
          ...data.student_tecnology,
          computer_type: data.student_tecnology.computer_type,
          have_computer: data.student_tecnology.have_computer,
          have_internet: data.student_tecnology.have_internet,
          internet_speed: null,
          internet_type: null,
          previous_experience: false,
          programming_languages:
            data.student_tecnology.programming_languages ?? null,
        },
        under_age: age < 18,
      }
      // register student
      const { studentId, enrollmentId } = await registerStudent({
        moduleId: data.module_id,
        formData: studentData,
      })

      // upload annexes
      const promisesDocuments = data.documents?.map((document) => {
        const formData = new FormData()
        formData.append('document', document as File)
        formData.append('students', studentId)

        return registerDocuments(formData)
      })

      if (promisesDocuments) {
        const results = await Promise.allSettled(promisesDocuments)
        const error = results?.filter(
          (result) => result.status === 'rejected',
        )[0]

        if (error) {
          toast.warning(
            'Ocorreu error no uploads de algum documento, acesse o pefil do aluno para ver!',
            {
              duration: 3500,
              position: 'top-center',
              action: {
                label: 'Ver perfil',
                onClick: () => {
                  router.push(`/alunos/${enrollmentId}/`)
                },
              },
            },
          )
        }
      }

      toast.success('Aluno registrado com sucesso!', {
        duration: 3500,
        position: 'top-center',
      })

      methods.reset()
      setStep(STEPS.PERSONAL)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro interno, tente novamente mais tarde!'

      toast.error(errorMessage, {
        duration: 3000,
        position: 'top-center',
      })
    } finally {
      setIsPending(false)
    }
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
          {step === STEPS.COURSE && <StepCourse />}

          <div className="w-full flex justify-end gap-3">
            <Link href="/alunos">
              <Button
                type="button"
                title="Voltar"
                disabled={isPending}
                className="bg-[#5e81f418] hover:!bg-[#00000018] !text-[#0f2b92]"
              />
            </Link>

            <Button title="Salvar" isPending={isPending} />
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
