'use client'

import { Input } from '@/components/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/date-picker'

export function FormCourse() {
  return (
    <form className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-wrap gap-4">
        <div>
          <div className="w-full max-w-80 flex flex-col gap-1">
            <label className="text-sm font-normal">ID*</label>
            <Input variant="secondary" />

            {/* {errors.fullname && (
            <span className="text-xs text-red-500">
              {errors.fullname.message}
            </span>
          )} */}
          </div>

          <div className="w-full max-w-80 flex flex-col gap-1">
            <label className="text-sm font-normal">Nome completo</label>
            <Input variant="secondary" />

            {/* {errors.fullname && (
            <span className="text-xs text-red-500">
              {errors.fullname.message}
            </span>
          )} */}
          </div>

          <div className="w-full max-w-80 flex flex-col gap-1">
            <label className="text-sm font-normal">Periodo</label>

            <div className="flex gap-4">
              <DatePicker
                className="flex-1"
                variant="secondary"
                selected={new Date()}
                onSelect={() => {}}
              />
              <DatePicker
                className="flex-1"
                variant="secondary"
                selected={new Date()}
                onSelect={() => {}}
              />
            </div>

            {/* {errors.fullname && (
            <span className="text-xs text-red-500">
              {errors.fullname.message}
            </span>
          )} */}
          </div>

          <div className="w-full max-w-80 flex flex-col gap-1">
            <label className="text-sm font-normal">Investidor</label>

            <Select>
              <SelectTrigger variant="secondary">
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

            {/* {errors.fullname && (
            <span className="text-xs text-red-500">
              {errors.fullname.message}
            </span>
          )} */}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit">Salvar</Button>
        <Button variant="outline" type="button">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
