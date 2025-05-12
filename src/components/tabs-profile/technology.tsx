import { Controller, useFormContext } from 'react-hook-form'

// Components
import { Input } from '../input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FormStudentProfileType } from '@/app/(private)/alunos/[id]/container-tabs'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface PersonalDataProps {
  isEditing: boolean
}

export function Technology({ isEditing }: PersonalDataProps) {
  const { register, control } = useFormContext<FormStudentProfileType>()

  return (
    <div className="flex-1 px-6 py-8 bg-white">
      <div className="flex-1 flex flex-col gap-x-4 gap-y-6">
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-normal sm:text-nowrap">
            Você já estudou linguagem de programação?
          </label>

          <Controller
            name="student_tecnology.has_programming_knowledge"
            control={control}
            render={({ field }) => (
              <RadioGroup
                className="flex gap-7"
                onValueChange={(value) => field.onChange(value === 'true')}
                value={String(field.value)}
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="knows_programming_yes" />
                  <label
                    htmlFor="knows_programming_yes"
                    className="text-base font-normal"
                  >
                    Sim
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="knows_programming_no" />
                  <label
                    htmlFor="knows_programming_no"
                    className="text-base font-normal"
                  >
                    Não
                  </label>
                </div>
              </RadioGroup>
            )}
          />

          {errors.student_tecnology?.has_programming_knowledge && (
            <span className="text-xs text-red-500">
              {errors.student_tecnology.has_programming_knowledge.message}
            </span>
          )}
        </div>

        {String(watchHasProgrammingKnowledge) === 'true' && (
          <div className="w-full max-w-96 flex flex-col gap-1">
            <label className="text-sm font-normal">
              Quais linguagens? Separe por virgulas
            </label>

            <textarea
              placeholder="Javascript, Python..."
              className="h-14 px-3 py-2 text-sm text-gray-900 border border-[#b1b3b5] focus:outline-[#9c9d9e] :text-[#9c9d9e] focus-within:border-[#caccce] disabled:text-[#8181a5] disabled:bg-[#e9ecef] disabled:border-[#dddfe1] disabled::text-[#8181a5]"
              {...register('student_tecnology.programming_languages')}
            />

            {errors.student_tecnology?.programming_languages && (
              <span className="text-xs text-red-500">
                {errors.student_tecnology.programming_languages.message}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-x-4 gap-y-6">
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-normal sm:text-nowrap">
            Você possui computador?
          </label>

          <Controller
            name="student_tecnology.have_computer"
            control={control}
            render={({ field }) => (
              <RadioGroup
                className="flex gap-7"
                onValueChange={(value) => field.onChange(value === 'true')}
                value={String(field.value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="has_computer_yes" />
                  <label
                    htmlFor="has_computer_yes"
                    className="text-base font-normal"
                  >
                    Sim
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="has_computer_no" />
                  <label
                    htmlFor="has_computer_no"
                    className="text-base font-normal"
                  >
                    Não
                  </label>
                </div>
              </RadioGroup>
            )}
          />

          {errors.student_tecnology?.have_computer && (
            <span className="text-xs text-red-500">
              {errors.student_tecnology.have_computer.message}
            </span>
          )}
        </div>

        {String(watchHaveComputer) === 'true' && (
          <div className="w-full md:max-w-64 flex flex-col gap-1">
            <label className="text-sm font-normal">Seu computador é:</label>

            <Controller
              name="student_tecnology.computer_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger variant="secondary">
                    <SelectValue placeholder="Selecione o seu computador" />
                  </SelectTrigger>
                  <SelectContent className="text-gray-900">
                    <SelectItem value="Próprio">Próprio</SelectItem>
                    <SelectItem value="Compartilhado">Compartilhado</SelectItem>
                    <SelectItem value="Emprestado">Emprestado</SelectItem>
                    <SelectItem value="trabalho">Do trabalho</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.student_tecnology?.computer_type && (
              <span className="text-xs text-red-500">
                {errors.student_tecnology.computer_type.message}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="w-full flex-1 flex flex-col gap-x-4 gap-y-6">
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-normal sm:text-nowrap">
            Você possui internet em casa?
          </label>

          <Controller
            name="student_tecnology.have_internet"
            control={control}
            render={({ field }) => (
              <RadioGroup
                className="flex gap-7"
                onValueChange={(value) => field.onChange(value === 'true')}
                value={String(field.value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="has_internet_yes" />
                  <label
                    htmlFor="has_internet_yes"
                    className="text-base font-normal"
                  >
                    Sim
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="has_internet_no" />
                  <label
                    htmlFor="has_internet_no"
                    className="text-base font-normal"
                  >
                    Não
                  </label>
                </div>
              </RadioGroup>
            )}
          />

          {errors.student_tecnology?.have_internet && (
            <span className="text-xs text-red-500">
              {errors.student_tecnology.have_internet.message}
            </span>
          )}
        </div>

        {String(watchHaveInternet) === 'true' && (
          <div className="w-full md:max-w-64 flex flex-col gap-1">
            <label className="text-sm font-normal">Sua internet é:</label>

            <Controller
              name="student_tecnology.internet_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger variant="secondary">
                    <div className="truncate whitespace-nowrap overflow-hidden w-full text-left">
                      <SelectValue placeholder="Selecione sua internet" />
                    </div>
                  </SelectTrigger>

                  <SelectContent className="text-gray-900">
                    <SelectItem value="rede_comunitaria">
                      Através de uma rede comunitária
                    </SelectItem>
                    <SelectItem value="apenas_celular">
                      Através do celular (3G ou 4G)
                    </SelectItem>
                    <SelectItem value="provedor">
                      Através de um provedor oficial (NET, Vivo, Claro, Tim...)
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.student_tecnology?.internet_type && (
              <span className="text-xs text-red-500">
                {errors.student_tecnology.internet_type.message}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
