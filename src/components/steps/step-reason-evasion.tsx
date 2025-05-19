import { Controller, useFormContext } from 'react-hook-form'

import * as yup from 'yup'

// Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export const formReasonEvasionSchema = yup.object({
  reason_give_up: yup.string().when('$isEvaded', {
    is: true,
    then: (schema) => schema.required('Selecione a razão.'),
    otherwise: (schema) => schema.notRequired(),
  }),
})

export type FormReasonEvasionType = yup.InferType<
  typeof formReasonEvasionSchema
>

interface StepReasonEvasionProps {
  isEditing: boolean
}

export function StepReasonEvasion({ isEditing }: StepReasonEvasionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormReasonEvasionType>()

  return (
    <div className="h-full flex-1 bg-white">
      <div className="flex flex-wrap gap-x-4 gap-y-6">
        <div className="w-full max-w-80 flex flex-col gap-1">
          <label className="text-sm font-normal">Motivo da Evasão</label>

          <Controller
            name="reason_give_up"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <SelectTrigger
                  variant="secondary"
                  disabled={!isEditing}
                  className="flex-1 py-2 px-3 text-sm  rounded-none disabled:border-[#dddfe1] disabled:bg-[#e9ecef]"
                >
                  <SelectValue placeholder="Selecione o motivo da evasão" />
                </SelectTrigger>

                <SelectContent className="text-gray-900">
                  <SelectItem value="Sem resposta">Sem resposta</SelectItem>
                  <SelectItem value="Conflito de horários">
                    Conflito de horários
                  </SelectItem>
                  <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                  <SelectItem value="Trabalho">Trabalho</SelectItem>
                  <SelectItem value="Dificuldades técnicas">
                    Dificuldades técnicas
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.reason_give_up && (
            <span className="text-xs text-red-500">
              {errors.reason_give_up.message}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
