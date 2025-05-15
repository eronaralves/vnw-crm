'use client'

import { useState } from 'react'
import { format, setYear } from 'date-fns'
import { UTCDate } from '@date-fns/utc'
import { CalendarIcon } from 'lucide-react'

// Components
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  onSelect: (date: Date | undefined) => void
  selected: Date | undefined
  minDate?: Date
  disabled?: boolean
  formatDate?: string
  isPickerYearDate?: boolean
  variant?: 'primary' | 'secondary'
  className?: string
  placeholder?: string
}

export function DatePicker({
  onSelect,
  selected,
  minDate,
  disabled = false,
  isPickerYearDate = false,
  variant = 'primary',
  formatDate = 'dd-MM-yyyy',
  className,
  placeholder = 'Selecione a data',
}: DatePickerProps) {
  const [monthYearDate, setMonthYearDate] = useState<Date>(
    selected ?? new Date(),
  )
  const dateInUtc = new UTCDate(selected ?? new Date())

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 101 }, (_, i) => currentYear - i)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'w-max flex-1 h-auto bg-transparent text-sm pacity-100 text-gray-900 outline-none justify-start text-left font-normal rounded-none border border-[#0f2b92] ',
            variant === 'secondary' &&
              'border-[#b1b3b5]  focus-within:border-[#caccce]',
            disabled &&
              'border-[#dddfe1] text-[#8181a5] bg-[#e9ecef] outline-none !opacity-100',
            className,
          )}
        >
          {selected ? (
            format(dateInUtc, formatDate)
          ) : (
            <span className="text-[#8181a5]">{placeholder}</span>
          )}
          <CalendarIcon
            className="ml-auto"
            color={selected ? '#06080E' : '#8181a5'}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 " align="start">
        {isPickerYearDate && (
          <div className="flex gap-2 ">
            <Select
              value={String(monthYearDate?.getFullYear())}
              onValueChange={(year) => {
                const updated = setYear(monthYearDate, Number(year))
                setMonthYearDate(updated)
              }}
            >
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="h-[250px]">
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Calendar
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          mode="single"
          selected={selected}
          onSelect={onSelect}
          month={monthYearDate}
          onMonthChange={setMonthYearDate}
          disabled={(date: Date) => (minDate ? date < minDate : false)}
        />
      </PopoverContent>
    </Popover>
  )
}
