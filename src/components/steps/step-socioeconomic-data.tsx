import { Controller, useFormContext } from 'react-hook-form'
import * as yup from 'yup'

// Components
import { Input } from '../input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export const formSocioeconomicSchema = yup.object({
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

export type FormSocioeconomicType = yup.InferType<
  typeof formSocioeconomicSchema
>
interface StepSocioeconomicDataProps {
  isEditing?: boolean
}

export function StepSocioeconomicData({
  isEditing = true,
}: StepSocioeconomicDataProps) {
  const { register, control } = useFormContext<FormSocioeconomicType>()

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-wrap gap-x-4 gap-y-6">
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-normal">
            Incluindo você, quantas pessoas moram com você?
          </label>
          <div className="max-w-16">
            <Input
              variant="secondary"
              disabled={!isEditing}
              type="nunber"
              {...register('student_socioeconomic_data.housemates')}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-6 mt-6">
        <div className="w-full max-w-64 flex flex-col gap-1">
          <label className="text-sm font-normal">
            Qual <strong>tipo</strong> de moradia que você reside?
          </label>
          <Controller
            name="student_socioeconomic_data.home_type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  variant="secondary"
                  disabled={!isEditing}
                  className="flex-1 w-full py-2 px-3 text-sm  rounded-none disabled:border-[#dddfe1] disabled:bg-[#e9ecef]"
                >
                  <SelectValue placeholder="Selecione o tipo de moradia" />
                </SelectTrigger>

                <SelectContent className="text-gray-900">
                  <SelectItem value="Casa de Madeira">
                    Casa de Madeira
                  </SelectItem>
                  <SelectItem value="Casa de Alvenaria">
                    Casa de Alvenaria
                  </SelectItem>
                  <SelectItem value="Pau a Pique">Pau a Pique</SelectItem>
                  <SelectItem value="Palafita">Palafita</SelectItem>
                  <SelectItem value="Edifício">Edifício</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="w-full max-w-80 flex flex-col gap-1">
          <label className="text-sm font-normal">
            Qual <strong>condição</strong> da casa em que você reside?
          </label>
          <Controller
            name="student_socioeconomic_data.home_condition"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  variant="secondary"
                  disabled={!isEditing}
                  className="flex-1 w-full py-2 px-3 text-sm  rounded-none disabled:border-[#dddfe1] disabled:bg-[#e9ecef]"
                >
                  <SelectValue placeholder="Selecione a condição da casa" />
                </SelectTrigger>

                <SelectContent className="text-gray-900">
                  <SelectItem value="Própria">Própria</SelectItem>
                  <SelectItem value="Alugado">Alugado</SelectItem>
                  <SelectItem value="Financiado">Financiado</SelectItem>
                  <SelectItem value="Cedido">Cedido</SelectItem>
                  <SelectItem value="Alojamento">Alojamento</SelectItem>
                  <SelectItem value="República">República</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="w-full max-w-80 flex flex-col gap-1">
          <label className="text-sm font-normal">
            Quem é o responsável financeiro da sua família?
          </label>
          <Controller
            name="student_socioeconomic_data.main_income"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  variant="secondary"
                  disabled={!isEditing}
                  className="flex-1 w-full py-2 px-3 text-sm  rounded-none disabled:border-[#dddfe1] disabled:bg-[#e9ecef]"
                >
                  <SelectValue placeholder="Selecione o résponsavel financeiro" />
                </SelectTrigger>

                <SelectContent className="text-gray-900">
                  <SelectItem value="Apenas eu">Apenas eu</SelectItem>
                  <SelectItem value="Apenas meu cônjuge">
                    Apenas meu cônjuge
                  </SelectItem>
                  <SelectItem value="Meu cônjuge e eu">
                    Meu cônjuge e eu
                  </SelectItem>
                  <SelectItem value="Meus pais">Meus pais</SelectItem>
                  <SelectItem value="Outros familiares (irmão(ã), tio, avós)">
                    Outros familiares (irmão(ã), tio, avós)
                  </SelectItem>
                  <SelectItem value="Dividido entre todos os moradores">
                    Dividido entre todos os moradores
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="w-full sm:w-52 flex flex-col gap-1">
          <label className="text-sm font-normal">Qual a renda mensal?</label>
          <Controller
            name="student_socioeconomic_data.income_range"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  variant="secondary"
                  disabled={!isEditing}
                  className="flex-1 py-2 px-3 text-sm  rounded-none disabled:border-[#dddfe1] disabled:bg-[#e9ecef]"
                >
                  <SelectValue placeholder="Selecione a renda" />
                </SelectTrigger>

                <SelectContent className="text-gray-900">
                  <SelectItem value="Até 1">Até 1 salário mínimo</SelectItem>
                  <SelectItem value="De 1 a 2">
                    De 1 e 2 salários mínimos
                  </SelectItem>
                  <SelectItem value="De 2 a 3">
                    De 2 e 3 salários mínimos
                  </SelectItem>
                  <SelectItem value="Mais de 3">
                    Mais de 3 salários mínimos
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-6 mt-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-normal">
            Você ou algum membro da família recebe alguma auxilio do governo?
          </label>
          <Input
            variant="secondary"
            disabled={!isEditing}
            type="nunber"
            {...register('student_socioeconomic_data.government_benefit')}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-normal">
            Você possui alguma doença pré-existente/ doença crônica ou
            deficiência?
          </label>

          <Controller
            name="student_socioeconomic_data.chronic_diseases"
            control={control}
            render={({ field }) => (
              <RadioGroup
                className="flex gap-7"
                onValueChange={field.onChange}
                value={String(field.value)}
                disabled={!isEditing}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    id="chronic_diseases_yes"
                    value="true"
                    className="accent-blue-500"
                  />
                  <label
                    htmlFor="chronic_diseases_yes"
                    className="text-base font-normal"
                  >
                    Sim
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    id="chronic_diseases_no"
                    value="false"
                    className="data-[state=checked]:after:bg-red-600"
                  />
                  <label
                    htmlFor="chronic_diseases_no"
                    className="text-base font-normal"
                  >
                    Não
                  </label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-6 mt-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-normal">
            Você mora com algum(a) PNE - portador(a) de necessidades especiais?
          </label>

          <Controller
            name="student_socioeconomic_data.live_with_pwd"
            control={control}
            render={({ field }) => (
              <RadioGroup
                defaultValue="option-one"
                className="flex gap-7"
                onValueChange={field.onChange}
                value={String(field.value)}
                disabled={!isEditing}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="true"
                    id="live_with_pwd_yes"
                    className="accent-blue-500"
                  />

                  <label
                    htmlFor="live_with_pwd_yes"
                    className="text-base font-normal"
                  >
                    Sim
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    id="live_with_pwd_no"
                    value="false"
                    className="data-[state=checked]:after:bg-red-600"
                  />
                  <label
                    htmlFor="live_with_pwd_no"
                    className="text-base font-normal"
                  >
                    Não
                  </label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
      </div>
    </div>
  )
}
