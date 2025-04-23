import { Controller, useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import type { FormStudentProfileType } from '@/app/(private)/alunos/[id]/container-tabs'

interface ReasonEvasionProps {
  isEditing: boolean
}

export function ReasonEvasion({ isEditing }: ReasonEvasionProps) {
  const { control } = useFormContext<FormStudentProfileType>()

  return (
    <div className="h-full flex-1 px-6 py-8 bg-white">
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
        </div>
      </div>
    </div>
  )
}
