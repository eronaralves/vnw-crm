'use client'

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react'
import { Check, ChevronDown, Trash } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Fragment } from 'react'

interface SelectMultipleProps {
  filter: {
    value: string
    options: string[]
  }
}

export function SelectMultiple({ filter }: SelectMultipleProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const params = new URLSearchParams(searchParams.toString())

  function handleMultiSelect(filterKey: string, selected: string[]) {
    params.delete('page')
    params.delete(filterKey)

    selected.forEach((value) => {
      params.append(filterKey, value)
    })

    router.push(`?${params.toString()}`)
  }

  function handleRemoveAllFilter(filterKey: string) {
    params.delete(filterKey)
    router.push(`?${params.toString()}`)
  }

  return (
    <Listbox
      value={searchParams.getAll(filter.value)}
      onChange={(value) => handleMultiSelect(filter.value, value)}
      multiple
    >
      <div className="relative w-[180px] z-[999px]">
        <ListboxButton className="z-50 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
          <span className="block truncate ">
            {params?.getAll(filter.value)?.length
              ? `${params?.getAll(filter.value)?.length} selecionado(s)`
              : 'Todos'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </span>
        </ListboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100 overflow-auto bg-white"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute mt-1 overflow-auto max-h-[300px] min-w-[150px] z-[999px] rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filter?.options?.map((option, index) => (
              <ListboxOption
                key={index}
                value={option}
                className={({ active }) =>
                  `relative z-[999px] cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>

        {params?.getAll(filter.value)?.length > 0 && (
          <button
            onClick={() => handleRemoveAllFilter(filter.value)}
            className="absolute -right-7 top-2 cursor-pointer"
            title="Apagar filtros"
          >
            <Trash size={18} className="text-red-500" />
          </button>
        )}
      </div>
    </Listbox>
  )
}
