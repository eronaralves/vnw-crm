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
import { Journey } from '@/components/tabs-profile/journey'
import { PersonalData } from '@/components/tabs-profile/personal-data'
import { ReasonEvasion } from '@/components/tabs-profile/reason-evasion'
import { SocioeconomicData } from '@/components/tabs-profile/socioeconomic-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ButtonEvadeStudents } from '@/components/button-evade-students'
import { ButtonFailStudents } from '@/components/button-fail-students'

interface ContentProfileProps {
  student: ProfileStudent
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
  reason_give_up: yup.string(),
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

export type FormStudentProfileType = yup.InferType<typeof formProfileSchema>

export function ContainerTabs({ student }: ContentProfileProps) {
  const [isEditing, setIsEditing] = useState(false)

  const methods = useForm({
    resolver: yupResolver(formProfileSchema),
    defaultValues: {
      ...student,
      phone: formatPhone(student.phone),
      cpf: formatCpf(student.cpf),
      birth_date: new UTCDate(student.birth_date),
      age: differenceInYears(new Date(), new UTCDate(student.birth_date)),
    },
  })

  const router = useRouter()

  function onSubmit(data: FormStudentProfileType) {
    console.log(data)
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full h-full flex flex-col space-y-12 p-4">
        <div className="flex items-center gap-8 flex-wrap mt-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">{student.fullname}</h1>
              <p className="text-sm text-gray-500">{student.course.name}</p>
            </div>

            <TagStatus status={student.status} />
          </div>

          <div className="flex flex-wrap gap-x-2 gap-y-4">
            <Button
              title="Editar"
              onClick={() => setIsEditing(!isEditing)}
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
                  studentsEvaded={[student.id]}
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
          className="h-full flex flex-col"
        >
          <Tabs defaultValue="journey" className="flex-1 gap-0">
            <TabsList className="w-full min-h-max flex justify-start overflow-x-auto gap-1 border-b border-[#dee2e6]">
              <TabsTrigger
                value="journey"
                className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
              >
                Jornada do aluno
              </TabsTrigger>
              {student.status === 'Evadiu' && (
                <TabsTrigger
                  value="reason-evasion"
                  className="data-[state=active]:bg-[#173A92] bg-[#a7b1d7] max-w-max text-white h-12 px-8 rounded-b-none text-sm"
                >
                  Motivo da Evasão
                </TabsTrigger>
              )}
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

            <TabsContent value="journey" asChild>
              <div className="h-full  flex-1 flex flex-col overflow-auto">
                <Journey modules={student.course.modules} />
              </div>
            </TabsContent>

            {student.status === 'Evadiu' && (
              <TabsContent value="reason-evasion" asChild>
                <div className="h-full  flex-1 flex flex-col overflow-auto">
                  <ReasonEvasion isEditing={isEditing} />
                </div>
              </TabsContent>
            )}

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
