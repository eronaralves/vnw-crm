'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UTCDate } from '@date-fns/utc'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FormProvider } from 'react-hook-form'
import { differenceInYears } from 'date-fns'

// Icons
import { GraduationCap, Pencil, Share } from 'lucide-react'

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

  async function onChangeTab(value: TABS) {
    setTabCurrent(value as TABS)
  }

  function onSubmit(data: ProfileStudent) {
    console.log(data)
    setIsEditing(false)
  }

  return (
    <FormProvider {...methods}>
      <div className="h-full flex flex-col p-4">
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
                <Button
                  title="Formar"
                  className="bg-emerald-600 hover:bg-emerald-500"
                >
                  <GraduationCap size={16} />
                </Button>
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

        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex-1 flex flex-col space-y-6 overflow-hidden"
        >
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
        </form>

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
              type="button"
              disabled={!isEditing}
              onClick={methods.handleSubmit(onSubmit)}
              title="Salvar"
            />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
