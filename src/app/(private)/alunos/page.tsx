import { Suspense } from 'react'

// Components
import { ListStudent } from './list-students'
import { FormSearch } from '../../../components/form-search'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { TabsFilters } from './tabs-filter'

interface Students {
  searchParams: Promise<{
    status: 'Cursando' | 'Formado' | 'Evadiu' | 'Reprovado'
  }>
}

export default async function Students({ searchParams }: Students) {
  const search = await searchParams
  const status = search.status ?? 'Cursando'

  return (
    <div className="flex-1 h-full flex flex-col p-4 overflow-auto">
      <Tabs defaultValue={status ?? 'Cursando'} className="flex-1">
        <div className="w-full flex gap-3 flex-wrap items-center justify-between">
          <Suspense>
            <TabsFilters />
          </Suspense>

          <Suspense>
            <FormSearch />
          </Suspense>
        </div>

        <TabsContent
          value={status}
          className="pt-4 flex-1 h-full flex flex-col gap-10 "
        >
          <Suspense>
            <ListStudent status={status} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
