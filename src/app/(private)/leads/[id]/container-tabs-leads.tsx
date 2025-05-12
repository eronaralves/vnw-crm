'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UTCDate } from '@date-fns/utc'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, FormProvider } from 'react-hook-form'

// Icons
import { Pencil } from 'lucide-react'

// Utils
import { formatCpf } from '@/utils/format-cpf'
import { formatPhone } from '@/utils/format-phone'

// Http
import type { LeadProfile } from '@/http/leads/get-lead'

// Components
import { Button } from '@/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { differenceInYears } from 'date-fns'
import {
  formPersonalSchema,
  StepPersonalData,
} from '@/components/steps-new-students/step-personal-data'
import {
  formSocioeconomicSchema,
  StepSocioeconomicData,
} from '@/components/steps-new-students/step-socioeconomic-data'
import {
  formTechnologySchema,
  StepTechnology,
} from '@/components/steps-new-students/step-technology'
import {
  formEmpregabilitySchema,
  StepEmpregability,
} from '@/components/steps-new-students/step-employability'
import {
  formAnnexesSchema,
  StepAnnexes,
} from '@/components/steps-new-students/step-annexes'

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

  const schemaByStep: Record<TABS, yup.AnyObjectSchema> = {
    [TABS.PERSONAL]: formPersonalSchema,
    [TABS.SOCIO_ECONOMIC]: formSocioeconomicSchema,
    [TABS.TECHNOLOGY]: formTechnologySchema,
    [TABS.EMPREGABILITY]: formEmpregabilitySchema,
    [TABS.ANNEXES]: formAnnexesSchema,
  }

  const methods = useForm({
    resolver: yupResolver(schemaByStep[tabCurrent]),
    defaultValues: {
      ...lead,
      phone: formatPhone(lead.phone),
      cpf: formatCpf(lead.cpf),
      birth_date: new UTCDate(lead.birth_date),
      age: differenceInYears(new Date(), new UTCDate(lead.birth_date)),
    },
  })

  const router = useRouter()

  async function onChangeTab(value: TABS) {
    setTabCurrent(value as TABS)
  }

  function onSubmit(data: LeadProfile) {
    console.log(data)
    setIsEditing(false)
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
            <Button title="Salvar" />
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
