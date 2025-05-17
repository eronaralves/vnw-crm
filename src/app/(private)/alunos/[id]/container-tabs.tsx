'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UTCDate } from '@date-fns/utc'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FormProvider } from 'react-hook-form'
import { differenceInYears, format } from 'date-fns'

// Icons
import { Pencil, Share } from 'lucide-react'

// Utils
import { formatCpf } from '@/utils/format-cpf'
import { formatPhone } from '@/utils/format-phone'

// Http
import type { ProfileStudent } from '@/http/students/get-student'

// Components
import { Button } from '@/components/button'
import { TagStatus } from '@/components/tag-status'
import { StepJourney } from '@/components/steps/step-journey'
import { StepReasonEvasion } from '@/components/steps/step-reason-evasion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ButtonEvadeStudents } from '@/components/button-evade-students'
import { ButtonFailStudents } from '@/components/button-fail-students'
import {
  formTechnologySchema,
  StepTechnology,
} from '@/components/steps/step-technology'
import {
  formPersonalSchema,
  StepPersonalData,
} from '@/components/steps/step-personal-data'
import {
  formEmpregabilitySchema,
  StepEmpregability,
} from '@/components/steps/step-employability'
import { formAnnexesSchema, StepAnnexes } from '@/components/steps/step-annexes'
import {
  formSocioeconomicSchema,
  StepSocioeconomicData,
} from '@/components/steps/step-socioeconomic-data'
import { ButtonGraduatedStudents } from '@/components/button-graduated'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editStudent, type StudentToEdit } from '@/http/students/edit-student'
import { toast } from 'sonner'
import { dateDiff } from '@/utils/date-diff'

interface ContentProfileProps {
  student: ProfileStudent
}

enum TABS {
  JOURNEY = 'journey',
  REASON_EVASION = 'reason-evasion',
  PERSONAL = 'personal',
  SOCIO_ECONOMIC = 'socio-economic',
  TECHNOLOGY = 'technology',
  EMPREGABILITY = 'empregability',
  ANNEXES = 'annexes',
}

export function ContainerTabs({ student }: ContentProfileProps) {
  const [tabCurrent, setTabCurrent] = useState(TABS.JOURNEY)
  const [isEditing, setIsEditing] = useState(false)

  const emptySchema = yup.object().shape({})

  const schemaByStep: Record<TABS, yup.AnyObjectSchema> = {
    [TABS.JOURNEY]: emptySchema,
    [TABS.REASON_EVASION]: emptySchema,
    [TABS.PERSONAL]: formPersonalSchema,
    [TABS.SOCIO_ECONOMIC]: formSocioeconomicSchema,
    [TABS.TECHNOLOGY]: formTechnologySchema,
    [TABS.EMPREGABILITY]: formEmpregabilitySchema,
    [TABS.ANNEXES]: formAnnexesSchema,
  }

  const methods = useForm<ProfileStudent>({
    mode: 'onChange',
    resolver: yupResolver(schemaByStep[tabCurrent]),
    defaultValues: {
      ...student,
      phone: formatPhone(student.phone),
      cpf: formatCpf(student.cpf),
      birth_date: new UTCDate(student.birth_date),
      age: differenceInYears(new Date(), new UTCDate(student.birth_date)),
      student_empregability: {
        ...student.student_empregability,
        start_date: student.student_empregability.start_date
          ? new UTCDate(student.student_empregability.start_date)
          : undefined,
        end_date: student.student_empregability.end_date
          ? new UTCDate(student.student_empregability.end_date)
          : undefined,
      },
    },
  })

  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutateAsync: editStudentMutate, isPending } = useMutation({
    mutationFn: editStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-students'] })

      toast.success('Dados editado com sucesso, tente novamente!', {
        duration: 3000,
        position: 'top-center',
      })

      router.refresh()
      setIsEditing(false)
    },
    onError: (error) => {
      toast.error(error.message, { duration: 3000, position: 'top-center' })
      setIsEditing(false)
    },
  })

  async function onChangeTab(value: TABS) {
    setTabCurrent(value as TABS)
  }

  async function onSubmit(data: ProfileStudent) {
    const age = dateDiff({
      from: new UTCDate(data.birth_date),
      to: new UTCDate(),
    })

    const studentDataToEdit: StudentToEdit = {
      age,
      birth_date: format(new UTCDate(data.birth_date), 'yyyy-MM-dd'),
      cpf: data.cpf,
      email: data.email,
      emergency_kinship: data.emergency_kinship,
      emergency_name: data.emergency_name,
      emergency_phone: data.emergency_phone,
      emitter: data.emitter,
      father_name: data.father_name,
      fullname: data.fullname,
      gender: data.gender,
      hometown: data.hometown ?? null,
      hometown_state: data.hometown_state ?? null,
      interested_modality: data.interested_modality ?? undefined,
      marital_status: data.marital_status,
      modality: data.modality ?? null,
      mother_name: data.mother_name,
      phone: data.phone,
      reason_give_up: data.reason_give_up ?? null,
      religion: data.religion ?? null,
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
      student_empregability: {
        ...data.student_empregability,
        start_date: format(data.student_empregability.start_date, 'yyyy-MM-dd'),
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
        last_year_job: data.student_empregability.last_year_job ?? null,
        level_language: data.student_empregability.level_language,
        linkedin: data.student_empregability.linkedin,
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
      student_responsible: {
        cpf: data.student_responsible.cpf ?? null,
        email: data.student_responsible.email ?? null,
        emitter: data.student_responsible.emitter ?? null,
        fullname: data.student_responsible.fullname ?? null,
        phone: data.student_responsible.phone ?? null,
        relation: data.student_responsible.relation ?? null,
        rg: data.student_responsible.rg ?? null,
      },
      student_socioeconomic_data: {
        ...data.student_socioeconomic_data,
        chronic_diseases:
          String(data.student_socioeconomic_data.chronic_diseases) ?? null,
        family_income: data.student_socioeconomic_data.family_income,
        government_benefit:
          data.student_socioeconomic_data.government_benefit ?? null,
        have_children: data.student_socioeconomic_data.have_children,
        home_condition: data.student_socioeconomic_data.home_condition,
        home_type: data.student_socioeconomic_data.home_type,
        housemates: data.student_socioeconomic_data.housemates
          ? parseInt(data.student_socioeconomic_data.housemates)
          : null,
        income_range: data.student_socioeconomic_data.income_range,
        live_with_pwd: data.student_socioeconomic_data.live_with_pwd,
        main_income: data.student_socioeconomic_data.main_income,
      },
      student_tecnology: {
        ...data.student_tecnology,
        computer_type: data.student_tecnology.computer_type,
        have_computer: data.student_tecnology.have_computer,
        have_internet: data.student_tecnology.have_internet,
        internet_speed: data.student_tecnology.internet_speed ?? null,
        internet_type: data.student_tecnology.internet_type ?? null,
        previous_experience: data.student_tecnology.previous_experience,
        programming_languages:
          data.student_tecnology.programming_languages ?? null,
      },
      under_age: data.age < 18,
    }

    console.log(studentDataToEdit)

    const results = await Promise.allSettled([
      editStudentMutate({
        studentId: student.id,
        formData: studentDataToEdit,
      }),
    ])

    console.log(results)
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="h-full flex flex-col p-4"
      >
        <div className="flex items-center gap-8 flex-wrap mt-2 mb-4">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">{student.fullname}</h1>
              <p className="text-sm text-gray-500">{student.course.name}</p>
            </div>

            <TagStatus status={student.status} />
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-4">
            <Button
              type="button"
              title={isEditing ? 'Resetar' : 'Editar'}
              onClick={() => {
                methods.reset()
                setIsEditing(!isEditing)
              }}
              className="flex items-center gap-1"
            >
              <Pencil size={16} />
            </Button>
            {student.status === 'Cursando' && (
              <>
                <ButtonGraduatedStudents
                  graduatedStudents={[
                    {
                      enrollmentId: student.errolmentId,
                    },
                  ]}
                  onSuccess={() => router.refresh()}
                />

                <ButtonFailStudents
                  studentsFaileds={[
                    {
                      id_student: student.id,
                      id_module: student.course.moduleCurrent,
                    },
                  ]}
                  onSuccess={() => router.refresh()}
                />

                <ButtonEvadeStudents
                  studentEvaded={{
                    studentId: student.id,
                    enrollmentId: student.errolmentId,
                    moduleId: student.course.moduleCurrent,
                  }}
                  onSuccess={() => router.refresh()}
                />
                <Button
                  title="Transferir"
                  className="border border-zinc-500 bg-transparent text-zinc-500 hover:bg-zinc-500 hover:text-white"
                >
                  <Share size={16} />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
          <Tabs
            value={tabCurrent}
            onValueChange={(value) => onChangeTab(value as TABS)}
            className="flex-1 overflow-hidden gap-0"
          >
            <TabsList className="w-full min-h-max flex justify-start overflow-x-auto gap-1 border-b border-[#dee2e6]">
              <TabsTrigger
                value={TABS.JOURNEY}
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Jornada do aluno
              </TabsTrigger>
              {student.status === 'Evadiu' && (
                <TabsTrigger
                  value={TABS.REASON_EVASION}
                  className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
                >
                  Motivo da Evasão
                </TabsTrigger>
              )}
              <TabsTrigger
                value={TABS.PERSONAL}
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger
                value={TABS.SOCIO_ECONOMIC}
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Dados socioeconômicos
              </TabsTrigger>
              <TabsTrigger
                value={TABS.TECHNOLOGY}
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] min-w-[170px] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Tecnologia
              </TabsTrigger>
              <TabsTrigger
                value={TABS.EMPREGABILITY}
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Empregabilidade
              </TabsTrigger>
              <TabsTrigger
                value={TABS.ANNEXES}
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] min-w-[170px] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Anexos
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value={TABS.JOURNEY}
              className="flex-1 overflow-auto p-6 bg-white"
            >
              <StepJourney modules={student.course.modules} />
            </TabsContent>

            {student.status === 'Evadiu' && (
              <TabsContent
                value={TABS.REASON_EVASION}
                className="flex-1 overflow-auto p-6 bg-white"
              >
                <StepReasonEvasion isEditing={isEditing} />
              </TabsContent>
            )}

            <TabsContent
              value={TABS.PERSONAL}
              className="flex-1 overflow-auto p-6 bg-white"
            >
              <StepPersonalData isEditing={isEditing} />
            </TabsContent>
            <TabsContent
              value={TABS.SOCIO_ECONOMIC}
              className="flex-1 overflow-auto p-6 bg-white"
            >
              <StepSocioeconomicData isEditing={isEditing} />
            </TabsContent>
            <TabsContent
              value={TABS.TECHNOLOGY}
              className="flex-1 overflow-auto p-6 bg-white"
            >
              <StepTechnology isEditing={isEditing} />
            </TabsContent>
            <TabsContent
              value={TABS.EMPREGABILITY}
              className="flex-1 overflow-auto p-6 bg-white"
            >
              <StepEmpregability isEditing={isEditing} />
            </TabsContent>
            <TabsContent
              value={TABS.ANNEXES}
              className="flex-1 overflow-auto p-6 bg-white"
            >
              <StepAnnexes isEditing={isEditing} />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <hr className="w-full min-h-[8px] bg-gradient-primary" />
          <div className="flex justify-end gap-3 px-4 pt-4">
            <Button
              type="button"
              title="Voltar"
              className="bg-[#5e81f418] hover:!bg-[#00000018] !text-[#0f2b92]"
              onClick={() => router.back()}
            />

            <Button
              type="submit"
              disabled={!isEditing || isPending}
              isPending={isPending}
              title="Salvar"
            />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
