'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UTCDate } from '@date-fns/utc'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FormProvider, type Resolver } from 'react-hook-form'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Icons
import { AlertCircle, Pencil } from 'lucide-react'

// Utils
import { dateDiff } from '@/utils/date-diff'
import { formatCpf } from '@/utils/format-cpf'
import { formatPhone } from '@/utils/format-phone'

// Http
import {
  editProfileData,
  type StudentToEdit,
} from '@/http/students/edit-profile-data'
import type { LeadProfile } from '@/http/leads/get-lead'

// Components
import { Button } from '@/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { differenceInYears, format } from 'date-fns'
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

enum TABS {
  PERSONAL = 'personal',
  SOCIO_ECONOMIC = 'socio-economic',
  TECHNOLOGY = 'technology',
  EMPREGABILITY = 'empregability',
  ANNEXES = 'annexes',
}
interface ContentProfileProps {
  lead: LeadProfile
}

export function ContainerTabsLeads({ lead }: ContentProfileProps) {
  const [tabCurrent, setTabCurrent] = useState(TABS.PERSONAL)
  const [isEditing, setIsEditing] = useState(false)

  const fullSchema = formPersonalSchema
    .concat(formSocioeconomicSchema)
    .concat(formTechnologySchema)
    .concat(formEmpregabilitySchema)
    .concat(formAnnexesSchema)

  type FormData = yup.InferType<typeof fullSchema>

  const methods = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(fullSchema) as Resolver<FormData>,
    defaultValues: {
      ...lead,
      phone: formatPhone(lead.phone),
      cpf: formatCpf(lead.cpf),
      birth_date: new UTCDate(lead.birth_date),
      age: differenceInYears(new Date(), new UTCDate(lead.birth_date)),
      student_empregability: {
        ...lead.student_empregability,
        start_date: lead?.student_empregability?.start_date
          ? new UTCDate(lead.student_empregability.start_date)
          : undefined,
        end_date: lead?.student_empregability?.end_date
          ? new UTCDate(lead.student_empregability.end_date)
          : undefined,
      },
    },
  })

  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate: editStudentMutate, isPending } = useMutation({
    mutationFn: editProfileData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-leads'] })

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

  function onSubmit(data: FormData) {
    const age = dateDiff({
      from: new UTCDate(data.birth_date),
      to: new UTCDate(),
    })

    const leadDataToEdit: StudentToEdit = {
      phone: data.phone.replace(/[()\-\s]/g, ''),
      birth_date: format(new UTCDate(data.birth_date), 'yyyy-MM-dd'),
      age,
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
      reason_give_up: null,
      religion: '',
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

    editStudentMutate({
      studentId: lead.id,
      formData: leadDataToEdit,
    })
    setIsEditing(false)
  }

  function hasTabErrors(tab: TABS): boolean {
    const errorPaths = Object.keys(methods.formState.errors)

    switch (tab) {
      case TABS.PERSONAL:
        return errorPaths.some(
          (path) =>
            path.startsWith('fullname') ||
            path.startsWith('cpf') ||
            path.startsWith('birth_date') ||
            path.startsWith('linkedin'),
        )
      case TABS.SOCIO_ECONOMIC:
        return errorPaths.some((path) =>
          path.startsWith('student_socioeconomic_data'),
        )
      case TABS.TECHNOLOGY:
        return errorPaths.some((path) => path.startsWith('student_tecnology'))
      case TABS.EMPREGABILITY:
        return errorPaths.some((path) =>
          path.startsWith('student_empregability'),
        )
      case TABS.ANNEXES:
        return errorPaths.some((path) => path.startsWith('student_annexes'))
      default:
        return false
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center gap-8 flex-wrap mt-2 mb-4">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">{lead.fullname}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-4">
            <Button
              title={isEditing ? 'Resetar' : 'Editar'}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1"
            >
              <Pencil size={16} />
            </Button>
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
                value={TABS.PERSONAL}
                className="relative data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Dados Pessoais
                {hasTabErrors(TABS.PERSONAL) && (
                  <AlertCircle
                    className="absolute -right-1 -top-1 w-4 h-4 bg-orange-500 rounded-full shadow-sm"
                    size={16}
                  />
                )}
              </TabsTrigger>
              <TabsTrigger
                value={TABS.SOCIO_ECONOMIC}
                className="relative data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Dados socioeconômicos
                {hasTabErrors(TABS.SOCIO_ECONOMIC) && (
                  <AlertCircle
                    className="absolute -right-1 -top-1 w-4 h-4 bg-orange-500 rounded-full shadow-sm"
                    size={16}
                  />
                )}
              </TabsTrigger>
              <TabsTrigger
                value={TABS.TECHNOLOGY}
                className="relative data-[state=active]:bg-[#173A92] bg-[#a7b1d7] min-w-[170px] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Tecnologia
                {hasTabErrors(TABS.TECHNOLOGY) && (
                  <AlertCircle
                    className="absolute -right-1 -top-1 w-4 h-4 bg-orange-500 rounded-full shadow-sm"
                    size={16}
                  />
                )}
              </TabsTrigger>
              <TabsTrigger
                value={TABS.EMPREGABILITY}
                className="relative data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Empregabilidade
                {hasTabErrors(TABS.EMPREGABILITY) && (
                  <AlertCircle
                    className="absolute -right-1 -top-1 w-4 h-4 bg-orange-500 rounded-full shadow-sm"
                    size={16}
                  />
                )}
              </TabsTrigger>
              <TabsTrigger
                value={TABS.ANNEXES}
                className="relative data-[state=active]:bg-[#173A92] bg-[#a7b1d7] min-w-[170px] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Anexos
              </TabsTrigger>
            </TabsList>

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
              <StepAnnexes studentId={lead.id} isEditing={isEditing} />
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
              title="Salvar"
              type="button"
              onClick={methods.handleSubmit(onSubmit)}
              isPending={isPending}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
