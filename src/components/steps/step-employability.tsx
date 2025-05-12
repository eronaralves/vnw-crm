import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import * as yup from 'yup'

// Components
import { Input } from '../input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select'
import { DatePicker } from '../date-picker'

// Schema
export const formEmpregabilitySchema = yup.object({
  student_empregability: yup.object({
    work: yup.boolean().required('Selecione uma opção.'),
    work_role: yup.string().when('work', {
      is: true,
      then: (schema) => schema.required('Digite seu cargo/função.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    work_modality: yup.string().when('work', {
      is: true,
      then: (schema) => schema.required('Selecione a modalidade.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    work_type: yup.string().when('work', {
      is: true,
      then: (schema) => schema.required('Selecione o seu emprego.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    recruitment_channel: yup.string().when('work', {
      is: true,
      then: (schema) => schema.required('Selecione como conseguiu o emprego.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    // last_year_job: yup.string().when('work', {
    //   is: false,
    //   then: (schema) => schema.required('Selecione o seu emprego.'),
    //   otherwise: (schema) =>
    //     schema.nullable().transform(() => {
    //       return null
    //     }),
    // }),
    partner_empress: yup.boolean().required('Selecione uma opção'),
    enterprise_name: yup.string(),
    last_work_role: yup.string().when('work', {
      is: false,
      then: (schema) => schema.required('Digite o cargo.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    last_work_modality: yup.string().when('work', {
      is: false,
      then: (schema) => schema.required('Selecione a modalidade.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    last_work_type: yup.string().when('work', {
      is: false,
      then: (schema) => schema.required('Selecione o emprego/trabalho.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    start_date: yup.date().required('Selecione a data inicio'),
    end_date: yup.date().when('work', {
      is: false,
      then: (schema) => schema.required('Selecione a data final'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    years_worked: yup.string(),
    study: yup.boolean().required('Selecione uma opção.'),
    study_modality: yup.string().when('study', {
      is: true,
      then: (schema) => schema.required('Selecione a modalidade.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    currently_studying: yup.string().when('study', {
      is: true,
      then: (schema) => schema.required('Digite a série/ano/semestre.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    last_grade: yup.string().when('study', {
      is: false,
      then: (schema) => schema.required('Digite a série/ano/semestre.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    intend_study: yup.boolean().when('study', {
      is: false,
      then: (schema) => schema.required('Selecione uma opção.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    motive_intend_study: yup.string().when('intend_study', {
      is: false,
      then: (schema) => schema.required('Digite o motivo.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    other_language: yup.boolean().required('Selecione uma opção'),
    wich_language: yup.string().when('other_language', {
      is: true,
      then: (schema) => schema.required('Seleciona o idioma.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
    level_language: yup.string().when('other_language', {
      is: true,
      then: (schema) => schema.required('Seleciona o nivel.'),
      otherwise: (schema) =>
        schema.nullable().transform(() => {
          return null
        }),
    }),
  }),
})

type FormEmpregabilityType = yup.InferType<typeof formEmpregabilitySchema>

interface StepEmpregabilityProps {
  isEditing?: boolean
}

export function StepEmpregability({
  isEditing = true,
}: StepEmpregabilityProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormEmpregabilityType>()

  const watchIsWork = watch('student_empregability.work')
  const watchIsStudy = watch('student_empregability.study')
  const watchIntendStudy = watch('student_empregability.intend_study')
  const watchOtherLanguage = watch('student_empregability.other_language')

  return (
    <div className="flex-1 bg-white overflow-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Atualmente, você está trabalhando? Tem alguma fonte de renda?
            </label>

            <Controller
              name="student_empregability.work"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(val) => field.onChange(val === 'true')}
                  value={String(field.value)}
                  className="flex gap-x-4 gap-y-6"
                  disabled={!isEditing}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="work_yes" value="true" />
                    <label htmlFor="work_yes" className="text-base">
                      Sim
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="work_no" value="false" />
                    <label htmlFor="work_no" className="text-base">
                      Não
                    </label>
                  </div>
                </RadioGroup>
              )}
            />

            {errors.student_empregability?.work && (
              <span className="text-xs text-red-500">
                {errors.student_empregability.work.message}
              </span>
            )}
          </div>

          {watchIsWork === true ? (
            <div className="flex flex-wrap gap-x-4 gap-y-6">
              <div className="w-full max-w-96 flex flex-col gap-1">
                <label className="text-sm">
                  Qual cargo/função você executa?
                </label>

                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('student_empregability.work_role')}
                />

                {errors.student_empregability?.work_role && (
                  <span className="text-xs text-red-500">
                    {errors.student_empregability.work_role.message}
                  </span>
                )}
              </div>

              <div className="w-full max-w-96 flex flex-col gap-1">
                <label className="text-sm">
                  Modalidade deste emprego/trabalho
                </label>

                <Controller
                  control={control}
                  name="student_empregability.work_modality"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger variant="secondary" disabled={!isEditing}>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent className="text-gray-900">
                        <SelectItem value="Diarista (todos os dias úteis)">
                          Diarista (todos os dias úteis)
                        </SelectItem>
                        <SelectItem value="Plantonista (seguindo escala)">
                          Plantonista (seguindo escala)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.student_empregability?.work_modality && (
                  <span className="text-xs text-red-500">
                    {errors.student_empregability.work_modality.message}
                  </span>
                )}
              </div>

              <div className="w-full max-w-96 flex flex-col gap-1">
                <label className="text-sm">Este emprego/trabalho é:</label>

                <Controller
                  name="student_empregability.work_type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger variant="secondary" disabled={!isEditing}>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent className="text-gray-900">
                        <SelectItem value="Temporário/freelancer">
                          Temporário/freelancer
                        </SelectItem>
                        <SelectItem value="CLT (carteira assinada)">
                          CLT (carteira assinada)
                        </SelectItem>
                        <SelectItem value="Via MEI (microempreendedor)">
                          Via MEI (microempreendedor)
                        </SelectItem>
                        <SelectItem value="Trabalho por conta própria/autônomo(a)">
                          Trabalho por conta própria/autônomo(a)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.student_empregability?.work_type && (
                  <span className="text-xs text-red-500">
                    {errors.student_empregability.work_type.message}
                  </span>
                )}
              </div>

              <div className="w-full max-w-96 flex flex-col gap-1">
                <label className="text-sm">Como conseguiu esse emprego?</label>

                <Controller
                  control={control}
                  name="student_empregability.recruitment_channel"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger variant="secondary" disabled={!isEditing}>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent className="text-gray-900">
                        <SelectItem value="Linkedin">Linkedin</SelectItem>
                        <SelectItem value="Indicação de terceiros">
                          Indicação de terceiros
                        </SelectItem>
                        <SelectItem value="Rede do Vai na Web">
                          Rede do Vai na Web
                        </SelectItem>
                        <SelectItem value="Sites especializados">
                          Sites especializados
                        </SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.student_empregability?.recruitment_channel && (
                  <span className="text-xs text-red-500">
                    {errors.student_empregability.recruitment_channel.message}
                  </span>
                )}
              </div>

              {/* Adicionar outros */}

              <div className="w-full flex flex-wrap gap-x-4 gap-y-6">
                <div className="flex flex-col gap-1">
                  <label className="text-sm">É uma empresa parceira?</label>

                  <Controller
                    control={control}
                    name="student_empregability.partner_empress"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={(val) => field.onChange(val === 'true')}
                        value={String(field.value)}
                        className="flex gap-x-4 gap-y-6"
                        disabled={!isEditing}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="partner_yes" value="true" />
                          <label htmlFor="partner_yes" className="text-base">
                            Sim
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="partner_no" value="false" />
                          <label htmlFor="partner_no" className="text-base">
                            Não
                          </label>
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {errors.student_empregability?.partner_empress && (
                    <span className="text-xs text-red-500">
                      {errors.student_empregability.partner_empress.message}
                    </span>
                  )}
                </div>

                <div className="w-full max-w-96 flex flex-col gap-1">
                  <label className="text-sm">Nome da empresa</label>
                  <Input
                    variant="secondary"
                    disabled={!isEditing}
                    {...register('student_empregability.enterprise_name')}
                  />
                </div>

                <div className="w-max flex flex-col gap-1">
                  <label className="text-sm font-normal">Data de Início</label>

                  <Controller
                    name="student_empregability.start_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        variant="secondary"
                        disabled={!isEditing}
                        isPickerYearDate
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    )}
                  />

                  {errors.student_empregability?.start_date && (
                    <span className="text-xs text-red-500">
                      {errors.student_empregability.start_date.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            watchIsWork === false && (
              <div className="flex flex-wrap gap-x-4 gap-y-6">
                {/* <div className="w-full max-w-96 flex flex-col gap-1">
              <label className="text-sm">
                Em qual ano foi seu último emprego/trabalho?
              </label>
              <Input
                variant="secondary" disabled={!isEditing}
                {...register('student_empregability.last_year_job')}
              />
            </div> */}
                <div className="w-full max-w-96 flex flex-col gap-1">
                  <label className="text-sm">
                    Qual cargo/função você executava?
                  </label>

                  <Input
                    variant="secondary"
                    disabled={!isEditing}
                    {...register('student_empregability.last_work_role')}
                  />

                  {errors.student_empregability?.last_work_role && (
                    <span className="text-xs text-red-500">
                      {errors.student_empregability.last_work_role.message}
                    </span>
                  )}
                </div>

                <div className="w-full max-w-96 flex flex-col gap-1">
                  <label className="text-sm">
                    Modalidade deste emprego/trabalho era?
                  </label>

                  <Controller
                    control={control}
                    name="student_empregability.last_work_modality"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          variant="secondary"
                          disabled={!isEditing}
                        >
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent className="text-gray-900">
                          <SelectItem value="Diarista (todos os dias úteis)">
                            Diarista (todos os dias úteis)
                          </SelectItem>
                          <SelectItem value="Plantonista (seguindo escala)">
                            Plantonista (seguindo escala)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.student_empregability?.last_work_modality && (
                    <span className="text-xs text-red-500">
                      {errors.student_empregability.last_work_modality.message}
                    </span>
                  )}
                </div>

                <div className="w-full max-w-96 flex flex-col gap-1">
                  <label className="text-sm">Este emprego/trabalho era?</label>

                  <Controller
                    control={control}
                    name="student_empregability.last_work_type"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          variant="secondary"
                          disabled={!isEditing}
                        >
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent className="text-gray-900">
                          <SelectItem value="Temporário/freelancer">
                            Temporário/freelancer
                          </SelectItem>
                          <SelectItem value="CLT (carteira assinada)">
                            CLT (carteira assinada)
                          </SelectItem>
                          <SelectItem value="Via MEI (microempreendedor)">
                            Via MEI (microempreendedor)
                          </SelectItem>
                          <SelectItem value="Trabalho por conta própria/autônomo(a)">
                            Trabalho por conta própria/autônomo(a)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.student_empregability?.last_work_type && (
                    <span className="text-xs text-red-500">
                      {errors.student_empregability.last_work_type.message}
                    </span>
                  )}
                </div>

                <div className="w-full flex flex-wrap gap-x-4 gap-y-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">É uma empresa parceira?</label>

                    <Controller
                      control={control}
                      name="student_empregability.partner_empress"
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={(val) =>
                            field.onChange(val === 'true')
                          }
                          value={String(field.value)}
                          className="flex gap-x-4 gap-y-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem id="partner_yes" value="true" />
                            <label htmlFor="partner_yes" className="text-base">
                              Sim
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem id="partner_no" value="false" />
                            <label htmlFor="partner_no" className="text-base">
                              Não
                            </label>
                          </div>
                        </RadioGroup>
                      )}
                    />

                    {errors.student_empregability?.partner_empress && (
                      <span className="text-xs text-red-500">
                        {errors.student_empregability.partner_empress.message}
                      </span>
                    )}
                  </div>

                  <div className="w-full max-w-96 flex flex-col gap-1">
                    <label className="text-sm">Nome da empresa</label>
                    <Input
                      variant="secondary"
                      disabled={!isEditing}
                      {...register('student_empregability.enterprise_name')}
                    />
                  </div>

                  <div className="w-max flex flex-col gap-1">
                    <label className="text-sm font-normal">
                      Data de Início
                    </label>

                    <Controller
                      name="student_empregability.start_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          variant="secondary"
                          disabled={!isEditing}
                          isPickerYearDate
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      )}
                    />

                    {errors.student_empregability?.start_date && (
                      <span className="text-xs text-red-500">
                        {errors.student_empregability.start_date.message}
                      </span>
                    )}
                  </div>

                  <div className="w-max flex flex-col gap-1">
                    <label className="text-sm font-normal">Data final</label>

                    <Controller
                      name="student_empregability.end_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          variant="secondary"
                          disabled={!isEditing}
                          isPickerYearDate
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      )}
                    />

                    {errors.student_empregability?.end_date && (
                      <span className="text-xs text-red-500">
                        {errors.student_empregability.end_date.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* <div className="w-full max-w-96 flex flex-col gap-1">
              <label className="text-sm">
                Trabalhou nessa função durante quanto tempo?
              </label>
              <Input
                variant="secondary" disabled={!isEditing}
                {...register('student_empregability.years_worked')}
              />
            </div> */}
              </div>
            )
          )}
        </div>

        <hr />

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Neste momento, você está estudando?
            </label>

            <Controller
              control={control}
              name="student_empregability.study"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(val) => field.onChange(val === 'true')}
                  value={String(field.value)}
                  className="flex gap-x-4 gap-y-6"
                  disabled={!isEditing}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="study_yes" value="true" />
                    <label htmlFor="study_yes" className="text-base">
                      Sim
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="study_no" value="false" />
                    <label htmlFor="study_no" className="text-base">
                      Não
                    </label>
                  </div>
                </RadioGroup>
              )}
            />

            {errors.student_empregability?.study && (
              <span className="text-xs text-red-500">
                {errors.student_empregability.study.message}
              </span>
            )}
          </div>

          {watchIsStudy === true ? (
            <div className="flex flex-wrap gap-x-4 gap-y-6">
              <div className="w-full max-w-96 flex flex-col gap-1">
                <label className="text-sm">A modalidade deste estudo é?</label>

                <Controller
                  control={control}
                  name="student_empregability.study_modality"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger variant="secondary" disabled={!isEditing}>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent className="text-gray-900">
                        <SelectItem value="Ensino Fundamental">
                          Ensino Fundamental
                        </SelectItem>
                        <SelectItem value="Ensino Médio">
                          Ensino Médio
                        </SelectItem>
                        <SelectItem value="Ensino Superior">
                          Ensino Superior
                        </SelectItem>
                        <SelectItem value="Pós Graduação">
                          Pós Graduação
                        </SelectItem>
                        <SelectItem value="Cursos Livres">
                          Cursos Livres
                        </SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.student_empregability?.study_modality && (
                  <span className="text-xs text-red-500">
                    {errors.student_empregability.study_modality.message}
                  </span>
                )}
              </div>

              <div className="w-full max-w-96 flex flex-col gap-1">
                <label className="text-sm">
                  Em qual série/ano/período/semestre você está cursando?
                </label>

                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('student_empregability.currently_studying')}
                  placeholder="Ex: Segundo Semestre"
                />

                {errors.student_empregability?.currently_studying && (
                  <span className="text-xs text-red-500">
                    {errors.student_empregability.currently_studying.message}
                  </span>
                )}
              </div>
            </div>
          ) : (
            watchIsStudy === false && (
              <div className="flex flex-wrap gap-x-4 gap-y-6">
                <div className="w-full max-w-96 flex flex-col gap-1">
                  <label className="text-sm">
                    Em qual série/ano/curso/semestre/período você parou?
                  </label>

                  <Input
                    variant="secondary"
                    disabled={!isEditing}
                    {...register('student_empregability.last_grade')}
                    placeholder="Ex: Segundo Semestre"
                  />

                  {errors.student_empregability?.last_grade && (
                    <span className="text-xs text-red-500">
                      {errors.student_empregability.last_grade.message}
                    </span>
                  )}
                </div>
                <div className="w-full max-w-96 flex flex-col gap-1">
                  <label className="text-sm">
                    Você pretende voltar aos estudos?
                  </label>

                  <Controller
                    control={control}
                    name="student_empregability.intend_study"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={(val) => field.onChange(val === 'true')}
                        value={String(field.value)}
                        className="flex gap-x-4 gap-y-6"
                        disabled={!isEditing}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="intend_yes" value="true" />
                          <label htmlFor="intend_yes" className="text-base">
                            Sim
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="intend_no" value="false" />
                          <label htmlFor="intend_no" className="text-base">
                            Não
                          </label>
                        </div>
                      </RadioGroup>
                    )}
                  />

                  {errors.student_empregability?.intend_study && (
                    <span className="text-xs text-red-500">
                      {errors.student_empregability.intend_study.message}
                    </span>
                  )}
                </div>

                {watchIntendStudy === false && (
                  <div className="w-full flex flex-col gap-1">
                    <label className="text-sm">
                      Com base na sua resposta anterior, nos explique o motivo:
                    </label>

                    <textarea
                      disabled={!isEditing}
                      {...register('student_empregability.motive_intend_study')}
                      className="h-18 px-3 py-2 text-sm text-gray-900 border border-[#b1b3b5] focus:outline-[#9c9d9e] :text-[#9c9d9e] focus-within:border-[#caccce] disabled:text-[#8181a5] disabled:bg-[#e9ecef] disabled:border-[#dddfe1] disabled::text-[#8181a5]"
                    />

                    {errors.student_empregability?.motive_intend_study && (
                      <span className="text-xs text-red-500">
                        {
                          errors.student_empregability.motive_intend_study
                            .message
                        }
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Se você tem noções em algum idioma, além do português brasileiro?
            </label>

            <Controller
              control={control}
              name="student_empregability.other_language"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(val) => field.onChange(val === 'true')}
                  value={String(field.value)}
                  className="flex gap-x-4 gap-y-6"
                  disabled={!isEditing}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="lang_yes" value="true" />
                    <label htmlFor="lang_yes" className="text-base">
                      Sim
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="lang_no" value="false" />
                    <label htmlFor="lang_no" className="text-base">
                      Não
                    </label>
                  </div>
                </RadioGroup>
              )}
            />

            {errors.student_empregability?.other_language && (
              <span className="text-xs text-red-500">
                {errors.student_empregability.other_language.message}
              </span>
            )}
          </div>

          {watchOtherLanguage === true && (
            <div className="flex flex-wrap gap-x-4 gap-y-6">
              <div className="w-full max-w-96 flex flex-col gap-1">
                <label className="text-sm">Qual?</label>

                <Controller
                  control={control}
                  name="student_empregability.wich_language"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger variant="secondary" disabled={!isEditing}>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent className="text-gray-900">
                        <SelectItem value="Inglês">Inglês</SelectItem>
                        <SelectItem value="Espanhol">Espanhol</SelectItem>
                        <SelectItem value="Francês">Francês</SelectItem>
                        <SelectItem value="Japonês">Japonês</SelectItem>
                        <SelectItem value="Chinês mandarim">
                          Chinês mandarim
                        </SelectItem>
                        <SelectItem value="Alemão">Alemão</SelectItem>
                        <SelectItem value="Russo">Russo</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.student_empregability?.wich_language && (
                  <span className="text-xs text-red-500">
                    {errors.student_empregability.wich_language.message}
                  </span>
                )}
              </div>
              <div className="w-full max-w-96 flex flex-col gap-1">
                <label className="text-sm">
                  Em qual nível você se encontra?
                </label>

                <Controller
                  control={control}
                  name="student_empregability.level_language"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger variant="secondary" disabled={!isEditing}>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent className="text-gray-900">
                        <SelectItem value="Básico">Básico</SelectItem>
                        <SelectItem value="Intermediário">
                          Intermediário
                        </SelectItem>
                        <SelectItem value="Fluente">Fluente</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.student_empregability?.level_language && (
                  <span className="text-xs text-red-500">
                    {errors.student_empregability.level_language.message}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
