'use client'

import * as React from 'react'
import { format } from 'date-fns'
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

interface DatePickerProps {
  onSelect: () => void
  selected: Date
  minDate?: Date
}

export function DatePicker({ onSelect, selected, minDate }: DatePickerProps) {
  const dateInUtc = new UTCDate(selected)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={
            'flex-1 pacity-100 text-gray-900 outline-none justify-start text-left font-normal rounded-none border border-[#0f2b92] hover:bg-white'
          }
        >
          {selected ? (
            format(dateInUtc, 'dd-MM-yyyy')
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={(date: Date) => (minDate ? date < minDate : false)}
        />
      </PopoverContent>
    </Popover>
  )
}
