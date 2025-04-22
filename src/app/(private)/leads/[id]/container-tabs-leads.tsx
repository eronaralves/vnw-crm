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
import { PersonalData } from '@/components/tabs-profile/personal-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SocioeconomicData } from '@/components/tabs-profile/socioeconomic-data'
import { differenceInYears } from 'date-fns'

interface ContentProfileProps {
  lead: LeadProfile
}

const formProfileSchema = yup.object().shape({
  fullname: yup.string(),
  social_name: yup.string(),
  phone: yup.string(),
  cpf: yup.string(),
  email: yup.string().email(),
  birth_date: yup.date().required(),
  rg: yup.string(),
  age: yup.number(),
  emitter: yup.string(),
  mother_name: yup.string(),
  father_name: yup.string(),
  emergency_phone: yup.string().nullable(),
  emergency_name: yup.string().nullable(),
  emergency_kinship: yup.string().nullable(),
  marital_status: yup.string(),
  skin_color: yup.string(),
  gender: yup.string(),
  sexuality: yup.string(),
  student_responsible: yup.object({
    fullname: yup.string(),
    relation: yup.string(),
    cpf: yup.string(),
    rg: yup.string(),
    emitter: yup.string(),
    phone: yup.string(),
    email: yup.string().email(),
  }),
  student_address: yup.object({
    address: yup.object({
      postal_code: yup.string().nullable(),
      street: yup.string().nullable(),
      number: yup.string().nullable(),
      adjunct: yup.string().nullable(),
      district: yup.string().nullable(),
      city: yup.string().nullable(),
      state: yup.string().nullable(),
    }),
    community: yup.string().nullable(),
    notes: yup.string().nullable(),
  }),
  student_socioeconomic_data: yup.object({
    housemates: yup.string(),
    home_type: yup.string(),
    home_condition: yup.string(),
    main_income: yup.string(),
    income_range: yup.string(),
    government_benefit: yup.string(),
    chronic_diseases: yup.string(),
    live_with_pwd: yup.boolean(),
  }),
})

export type FormProfileType = yup.InferType<typeof formProfileSchema>

export function ContainerTabsLeads({ lead }: ContentProfileProps) {
  const [isEditing, setIsEditing] = useState(false)

  const methods = useForm({
    resolver: yupResolver(formProfileSchema),
    defaultValues: {
      ...lead,
      phone: formatPhone(lead.phone),
      cpf: formatCpf(lead.cpf),
      birth_date: new UTCDate(lead.birth_date),
      age: differenceInYears(new Date(), new UTCDate(lead.birth_date)),
    },
  })

  const router = useRouter()

  function onSubmit(data: FormProfileType) {
    console.log(data)
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full h-full flex flex-col space-y-12 p-4">
        <div className="flex items-center gap-8 flex-wrap mt-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">{lead.fullname}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-4">
            <Button
              title="Editar"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1"
            >
              <Pencil size={16} />
            </Button>
          </div>
        </div>

        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="h-full flex flex-col"
        >
          <Tabs defaultValue="personal-data" className="flex-1 gap-0">
            <TabsList className="w-full min-h-max flex justify-start overflow-x-auto gap-1 border-b border-[#dee2e6]">
              <TabsTrigger
                value="personal-data"
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger
                value="socioeconomic"
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Dados socioeconômicos
              </TabsTrigger>
              <TabsTrigger
                value="technology"
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] min-w-[170px] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Tecnologia
              </TabsTrigger>
              <TabsTrigger
                value="empregability"
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Empregabilidade
              </TabsTrigger>
              <TabsTrigger
                value="attachments"
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] min-w-[170px] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Anexos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal-data" asChild>
              <div className="h-full flex-1 flex flex-col">
                <PersonalData isEditing={isEditing} />
              </div>
            </TabsContent>

            <TabsContent value="socioeconomic" asChild>
              <div className="h-full flex-1 flex flex-col">
                <SocioeconomicData isEditing={isEditing} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="w-full flex flex-col gap-2 bg-white pb-4 px-4">
            <hr className="w-full min-h-[8px] bg-gradient-primary" />
            <div className="flex justify-end gap-3 ml-auto">
              <Button
                type="button"
                title="Voltar"
                className="bg-[#5e81f418] hover:!bg-[#00000018] !text-[#0f2b92]"
                onClick={() => router.back()}
              />
              {/* <Button title="Salvar" /> */}
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
