import { Suspense } from 'react'

// Types
import type { STATUS_STUDENT } from '@/types/status-student'

// Components
import { ListStudent } from './list-students'
import { FormSearch } from '../../../components/form-search'
import { Tabs } from '@/components/ui/tabs'
import { TabsFilters } from './tabs-filter'

type SearchParams = Promise<{ status: STATUS_STUDENT }>

export default async function Students(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const status = searchParams.status ?? 'Cursando'

  return (
    <div className="flex-1 h-full flex flex-col p-4 overflow-auto">
      <Suspense>
        <Tabs
          defaultValue={status}
          className="h-screen flex flex-col overflow-hidden"
        >
          <div className="w-full flex gap-3 flex-wrap items-center justify-between">
            <TabsFilters />

            <FormSearch />
          </div>

          <ListStudent status={status} />
        </Tabs>
      </Suspense>
    </div>
  )
}
