'use client'

import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter, useSearchParams } from 'next/navigation'

export function TabsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  function handleTabSelected(tab: string) {
    params.set('status', tab)

    router.replace(`?${params.toString()}`)
  }

  return (
    <TabsList className="border-b border-gray-200">
      <TabsTrigger
        value="Cursando"
        onClick={() => handleTabSelected('Cursando')}
        className="data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:text-[#173A92] data-[state=active]:border-[#7a82a7] p-4 text-sm "
      >
        Cursando
      </TabsTrigger>

      <TabsTrigger
        value="Evadiu"
        onClick={() => handleTabSelected('Evadiu')}
        className="data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:text-[#173A92] data-[state=active]:border-[#7a82a7] p-4 text-sm "
      >
        Evadidos
      </TabsTrigger>
      <TabsTrigger
        value="Reprovado"
        onClick={() => handleTabSelected('Reprovado')}
        className="data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:text-[#173A92] data-[state=active]:border-[#7a82a7] p-4 text-sm "
      >
        Reprovados
      </TabsTrigger>
      <TabsTrigger
        value="Formado"
        onClick={() => handleTabSelected('Formado')}
        className="data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:text-[#173A92] data-[state=active]:border-[#7a82a7] p-4 text-sm"
      >
        Formados
      </TabsTrigger>
    </TabsList>
  )
}
