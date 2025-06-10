import { Controller, useFormContext } from 'react-hook-form'
import { differenceInYears } from 'date-fns'
import * as yup from 'yup'

// Utils
import { formatPhone } from '@/utils/format-phone'
import { formatCpf } from '@/utils/format-cpf'

// Components
import { Input } from '../input'
import { DatePicker } from '../date-picker'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export const formPersonalSchema = yup.object({
  fullname: yup.string().required('Digite seu nome completo'),
  social_name: yup.string().nullable(),
  phone: yup.string().required('Digite seu celular').length(15, '11 digitos'),
  cpf: yup.string().required('Digite seu CPF').length(14, '11 digitos'),
  email: yup
    .string()
    .required('Digite seu e-mail')
    .email('Digite um e-mail válido'),
  birth_date: yup.date().required('Digite sua data'),
  rg: yup.string().nullable(),
  age: yup.number().nullable(),
  emitter: yup.string().nullable(),
  mother_name: yup.string().nullable(),
  father_name: yup.string().nullable(),
  emergency_phone: yup.string().nullable(),
  emergency_name: yup.string().nullable(),
  emergency_kinship: yup.string().nullable(),
  marital_status: yup.string().nullable(),
  skin_color: yup.string().nullable(),
  gender: yup.string().nullable(),
  sexuality: yup.string().nullable(),
  linkedin: yup.string().url('Digite uma url válida').nullable(),
  student_responsible: yup
    .object({
      fullname: yup.string().nullable(),
      relation: yup.string().nullable(),
      cpf: yup.string().nullable(),
      rg: yup.string().nullable(),
      emitter: yup.string().nullable(),
      phone: yup.string().nullable(),
      email: yup.string().email().nullable(),
    })
    .nullable()
    .optional(),
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
})

export type FormProfileType = yup.InferType<typeof formPersonalSchema>

interface StepPersonalDataProps {
  isEditing?: boolean
}

export function StepPersonalData({ isEditing = true }: StepPersonalDataProps) {
  const {
    register,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitted },
  } = useFormContext<FormProfileType>()
  const watchBirthDate = watch('birth_date')
  const age = watchBirthDate
    ? differenceInYears(new Date(), watchBirthDate)
    : null

  const isOfLegalAge =
    age || age === 0 ? (age < 18 ? 'true' : 'false') : undefined

  return (
    <div className="flex-1 bg-white overflow-auto">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-6">
        <div className="w-full max-w-80 flex flex-col gap-1">
          <label className="text-sm font-normal">Nome completo</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('fullname')}
          />

          {errors.fullname && (
            <span className="text-xs text-red-500">
              {errors.fullname.message}
            </span>
          )}
        </div>

        <div className="w-full max-w-80 flex flex-col gap-1">
          <label className="text-sm font-normal">Nome social</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('social_name')}
          />
        </div>

        <div className="w-full max-w-40 flex flex-col gap-1">
          <label className="text-sm font-normal">Celular</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('phone')}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value) as string
              setValue('phone', formatted, { shouldValidate: isSubmitted })
            }}
            maxLength={15}
          />

          {errors.phone && (
            <span className="text-xs text-red-500">{errors.phone.message}</span>
          )}
        </div>

        <div className="w-full max-w-64 flex flex-col gap-1">
          <label className="text-sm font-normal">E-mail</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('email')}
          />

          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="w-full max-w-36 flex flex-col gap-1">
          <label className="text-sm font-normal">CPF</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('cpf')}
            onChange={(e) => {
              const formatted = formatCpf(e.target.value) as string
              setValue('cpf', formatted, { shouldValidate: isSubmitted })
            }}
            maxLength={14}
          />

          {errors.cpf && (
            <span className="text-xs text-red-500">{errors.cpf.message}</span>
          )}
        </div>

        <div className="w-max flex flex-col gap-1">
          <label className="text-sm font-normal">Data de Nasc.</label>

          <Controller
            name="birth_date"
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

          {errors.birth_date && (
            <span className="text-xs text-red-500">
              {errors.birth_date.message}
            </span>
          )}
        </div>

        <div className="w-full max-w-[152px] flex flex-col gap-1">
          <label className="text-sm font-normal">RG</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('rg')}
          />
        </div>

        <div className="w-full max-w-[152px] flex flex-col gap-1">
          <label className="text-sm font-normal">Orgão emissor</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('emitter')}
          />
        </div>

        <div className="w-full max-w-80 flex flex-col gap-1">
          <label className="text-sm font-normal">Nome completo da Mãe</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('mother_name')}
          />
        </div>

        <div className="w-full max-w-80 flex flex-col gap-1">
          <label className="text-sm font-normal">Nome completo do pai</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('father_name')}
          />
        </div>

        <div className="w-full max-w-80 flex flex-col gap-1">
          <label className="text-sm font-normal">Linkedin</label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            {...register('linkedin')}
          />

          {errors?.linkedin && (
            <span className="text-xs text-red-500">
              {errors.linkedin.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-start  gap-x-4 gap-y-6 mt-6">
        <div className="w-full flex flex-col gap-3">
          <label className="text-lg font-semibold">Tem menos de 18 anos?</label>

          <RadioGroup className="flex gap-7" value={isOfLegalAge}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="true"
                id="isOfLegalAge_yes"
                className="accent-blue-500"
              />

              <label
                htmlFor="isOfLegalAge_yes"
                className="text-base font-normal"
              >
                Sim
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id="isOfLegalAge_no"
                value="false"
                className="data-[state=checked]:after:bg-red-600"
              />
              <label
                htmlFor="isOfLegalAge_no"
                className="text-base font-normal"
              >
                Não
              </label>
            </div>
          </RadioGroup>
        </div>
        {isOfLegalAge !== undefined &&
          (age! < 18 ? (
            <>
              <div className="w-full max-w-80 flex flex-col gap-1">
                <label className="text-sm font-normal">
                  Nome completo do responsável
                </label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('student_responsible.fullname')}
                />
              </div>

              <div className="w-full max-w-80 flex flex-col gap-1">
                <label className="text-sm font-normal">Parentesco</label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('student_responsible.relation')}
                />
              </div>

              <div className="w-full max-w-80 flex flex-col gap-1">
                <label className="text-sm font-normal">
                  CPF do responsável
                </label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('student_responsible.cpf')}
                />
              </div>

              <div className="w-full max-w-80 flex flex-col gap-1">
                <label className="text-sm font-normal">RG do responsável</label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('student_responsible.rg')}
                />
              </div>

              <div className="w-full max-w-80 flex flex-col gap-1">
                <label className="text-sm font-normal">Orgão emissor</label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('student_responsible.emitter')}
                />
              </div>

              <div className="w-full max-w-80 flex flex-col gap-1">
                <label className="text-sm font-normal">
                  Celular do responsável
                </label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('student_responsible.phone')}
                />
              </div>

              <div className="w-full max-w-80 flex flex-col gap-1">
                <label className="text-sm font-normal">
                  E-mail do responsável
                </label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('student_responsible.email')}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-full max-w-40 flex flex-col gap-1">
                <label className="text-sm font-normal">
                  Contato de emergência
                </label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('emergency_phone')}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value) as string
                    setValue('emergency_phone', formatted, {
                      shouldValidate: isSubmitted,
                    })
                  }}
                  maxLength={15}
                />
              </div>
              <div className="w-full max-w-40 flex flex-col gap-1">
                <label className="text-sm font-normal">Nome do contato</label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('emergency_name')}
                />
              </div>

              <div className="w-full max-w-40 flex flex-col gap-1">
                <label className="text-sm font-normal">Relação</label>
                <Input
                  variant="secondary"
                  disabled={!isEditing}
                  {...register('emergency_kinship')}
                />
              </div>
            </>
          ))}
      </div>

      <div className="flex flex-wrap items-start gap-x-4 gap-y-5 mt-6">
        <div className="w-full flex items-center gap-4">
          <h3 className="text-lg font-semibold">Endereço Residencial</h3>
          <hr className="flex-1 h-1" />
        </div>

        <div className="w-full flex flex-wrap gap-x-4 gap-y-6">
          <div className="w-full max-w-36 flex flex-col gap-1">
            <label className="text-sm font-normal">CEP</label>
            <Input
              variant="secondary"
              disabled={!isEditing}
              {...register('student_address.address.postal_code')}
            />
          </div>

          <div className="w-full max-w-64 flex flex-col gap-1">
            <label className="text-sm font-normal">Logradouro</label>
            <Input
              variant="secondary"
              disabled={!isEditing}
              {...register('student_address.address.street')}
            />
          </div>

          <div className="w-full max-w-16 flex flex-col gap-1">
            <label className="text-sm font-normal">Número</label>
            <Input
              variant="secondary"
              disabled={!isEditing}
              {...register('student_address.address.number')}
            />
          </div>

          <div className="w-full max-w-40 flex flex-col gap-1">
            <label className="text-sm font-normal">Complemento</label>
            <Input
              variant="secondary"
              disabled={!isEditing}
              {...register('student_address.address.adjunct')}
            />
          </div>

          <div className="w-full max-w-56 flex flex-col gap-1">
            <label className="text-sm font-normal">Bairro</label>
            <Input
              variant="secondary"
              disabled={!isEditing}
              {...register('student_address.address.district')}
            />
          </div>

          <div className="w-full max-w-52 flex flex-col gap-1">
            <label className="text-sm font-normal">Municipio</label>
            <Input
              variant="secondary"
              disabled={!isEditing}
              {...register('student_address.address.city')}
            />
          </div>

          <div className="w-full max-w-16 flex flex-col gap-1">
            <label className="text-sm font-normal">UF</label>
            <Input
              variant="secondary"
              disabled={!isEditing}
              {...register('student_address.address.state')}
              maxLength={2}
            />
          </div>

          <div className="w-full max-w-56 flex flex-col gap-1">
            <label className="text-sm font-normal">Comunidade</label>
            <Input
              variant="secondary"
              disabled={!isEditing}
              {...register('student_address.community')}
            />
          </div>

          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-normal">Observação</label>
            <textarea
              className="h-[150px] md:h-20 px-3 py-2 text-sm text-gray-900 border border-[#b1b3b5] focus:outline-[#9c9d9e] :text-[#9c9d9e] focus-within:border-[#caccce] disabled:text-[#8181a5] disabled:bg-[#e9ecef] disabled:border-[#dddfe1] disabled::text-[#8181a5]"
              disabled={!isEditing}
              {...register('student_address.notes')}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-5 mt-6">
        <div className="w-full flex items-center gap-4">
          <h3 className="text-lg font-semibold">Dados Sensíveis</h3>
          <hr className="flex-1 h-1" />
        </div>

        <div className="w-full flex flex-wrap gap-x-4 gap-y-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Estado civil</label>
            <Controller
              name="marital_status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <SelectTrigger
                    variant="secondary"
                    disabled={!isEditing}
                    className="min-w-28 flex-1"
                  >
                    <SelectValue placeholder="Selecione um estado civil" />
                  </SelectTrigger>

                  <SelectContent className="text-gray-900">
                    <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                    <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                    <SelectItem value="União Estável">União Estável</SelectItem>
                    <SelectItem value="Amasiado(a)">Amasiado(a)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Raça /Cor</label>
            <Controller
              name="skin_color"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <SelectTrigger
                    variant="secondary"
                    disabled={!isEditing}
                    className="min-w-28 flex-1"
                  >
                    <SelectValue placeholder="Selecione uma Raça /Cor" />
                  </SelectTrigger>

                  <SelectContent className="text-gray-900">
                    <SelectItem value="pretopardo">
                      Preto(a) ou pardo(a)
                    </SelectItem>
                    <SelectItem value="Branco(a)">Branco(a)</SelectItem>
                    <SelectItem value="Amarelo(a)">Amarelo(a)</SelectItem>
                    <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                    <SelectItem value="Indígena">Indígena</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Orientação sexual</label>
            <Controller
              name="sexuality"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <SelectTrigger
                    variant="secondary"
                    disabled={!isEditing}
                    className="min-w-28 flex-1"
                  >
                    <SelectValue placeholder="Selecione uma Orientação sexual" />
                  </SelectTrigger>

                  <SelectContent className="text-gray-900">
                    <SelectItem value="heterossexual">Heterossexual</SelectItem>
                    <SelectItem value="lesbica_ou_gay">Lésbica/Gay</SelectItem>
                    <SelectItem value="bissexual_pansexual">
                      Bissexual/Pansexual
                    </SelectItem>
                    <SelectItem value="assexual">Assexual</SelectItem>
                    <SelectItem value="prefiro_nao_dizer">
                      Prefiro não dizer
                    </SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-normal">Gênero</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <SelectTrigger
                    variant="secondary"
                    disabled={!isEditing}
                    className="min-w-28 flex-1"
                  >
                    <SelectValue placeholder="Selecione um Gênero" />
                  </SelectTrigger>

                  <SelectContent className="text-gray-900">
                    <SelectItem value="pretopardo">
                      Preto(a) ou pardo(a)
                    </SelectItem>
                    <SelectItem value="homemCis">homemCis</SelectItem>
                    <SelectItem value="mulherCis">mulherCis</SelectItem>
                    <SelectItem value="homemTrans">homemTrans</SelectItem>
                    <SelectItem value="mulherTrans">mulherTrans</SelectItem>
                    <SelectItem value="naoBinario">naoBinario</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
